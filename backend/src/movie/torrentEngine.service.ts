import { Injectable, NotFoundException, OnModuleDestroy } from '@nestjs/common';
import { ReadVResult } from 'fs';
const torrentStream = require('torrent-stream');



import * as path from 'path';

interface MovieTorrent {
  hash: string;
}

interface YTSMovie {
  torrents: MovieTorrent[];
}

interface YTSResponse {
  data: {
    movie_count: number;
    movies: YTSMovie[];
  };
}

@Injectable()
export class TorrentEngineCacheService implements OnModuleDestroy {
  private readonly config = {
    connections: 100,
    uploads: 10,
  };

  private readonly allowedExtensions = ['.mp4', '.mkv', '.avi', '.mov', '.webm', '.flv', '.wmv', '.mpg', '.mpeg'];
  private readonly engineCache = new Map<string, any>();
  private readonly engineLastAccessed = new Map<string, number>();
  private readonly magnetLinkCache = new Map<string, string>();
  private readonly videoFileCache = new Map<string, any>();

  private readonly ENGINE_TTL = 30 * 60 * 1000; // 30 minutes
  private readonly CLEANUP_INTERVAL = 5 * 60 * 1000; // 5 minutes
  private cleanupInterval: NodeJS.Timeout;

  constructor() {
    this.cleanupInterval = setInterval(() => this.cleanupInactiveEngines(), this.CLEANUP_INTERVAL);
  }

  private createCacheKey(imdbID: string, title: string, quality:string): string {
    return `${imdbID}:${title}:${quality}`;
  }

  async getOrFetchMagnetLink(imdbID: string, title: string, quality: string): Promise<string | null> {
    const cacheKey = this.createCacheKey(imdbID, title, quality);

    if (this.magnetLinkCache.has(cacheKey)) {
      return this.magnetLinkCache.get(cacheKey) || null;
    }

    const magnetLink = await this.getMagnetLink(title, imdbID, quality);
    if (magnetLink) {
      this.magnetLinkCache.set(cacheKey, magnetLink);
    }

    return magnetLink;
  }

  private async getMagnetLink(title: string, imdbID: string, quality: string): Promise<string | null> {
    // Try YTS API first
    try {
      const response = await fetch(`https://yts.mx/api/v2/list_movies.json?query_term=${imdbID}`);
      const result = await response.json();
      if (result.data.movies) {
        let movie = result.data.movies?.[0];
        if (movie && movie.torrents?.length > 0) {
            
            let hash = movie.torrents[0].hash;
            for (let i = 0; i < movie.torrents.length; i++) {
              if (movie.torrents[i].quality == quality) {
                hash = movie.torrents[i].hash
              }
            }

            const encodedTitle = encodeURIComponent(title);
            return `magnet:?xt=urn:btih:${hash}&dn=${encodedTitle}`;
        }
      }
    } catch (error) {
      console.error(`Error fetching from YTS API: ${error.message}`);
    }

    // Try RARBG API alternative
    try {
        const rarbgResponse = await fetch(`https://torrentio.strem.fun/stream/movie/${imdbID}.json`);
        if (rarbgResponse.ok) {
            const data = await rarbgResponse.json();
            if (data.streams && data.streams.length > 0) {
                // Find a good quality torrent (preferably 1080p)
                const sortedStreams = data.streams.sort((a, b) => {
                    // Prefer 1080p over other resolutions
                    const aHas1080 = a.title.includes('1080p');
                    const bHas1080 = b.title.includes('1080p');
                    if (aHas1080 && !bHas1080) return -1;
                    if (!aHas1080 && bHas1080) return 1;
                    return 0;
                });
                
                // Extract magnet link from the infoHash
                if (sortedStreams[0] && sortedStreams[0].infoHash) {
                    const encodedTitle = encodeURIComponent(title);
                    return `magnet:?xt=urn:btih:${sortedStreams[0].infoHash}&dn=${encodedTitle}`;
                }
            }
        }
    } catch (error) {
        console.error(`Error fetching from RARBG alternative: ${error.message}`);
    }

    // Try TorrentAPI alternative
    try {
        const searchQuery = encodeURIComponent(`${title} ${imdbID}`);
        const torrentApiResponse = await fetch(`https://torrentp2p.vercel.app/api/movies?q=${searchQuery}`);
        if (torrentApiResponse.ok) {
            const torrentData = await torrentApiResponse.json();
            if (torrentData.length > 0) {
                // Find a suitable torrent (good seeders, appropriate size)
                const sortedTorrents = torrentData.sort((a, b) => b.seeders - a.seeders);
                if (sortedTorrents[0] && sortedTorrents[0].magnet) {
                    return sortedTorrents[0].magnet;
                }
            }
        }
    } catch (error) {
        console.error(`Error fetching from TorrentAPI: ${error.message}`);
    }
    
    // Fallback to TPB proxy API
    try {
        const tpbResponse = await fetch(`https://apibay.org/q.php?q=${imdbID}`);
        if (tpbResponse.ok) {
            const tpbData = await tpbResponse.json();
            if (tpbData && tpbData.length > 0) {
                // Sort by seeders
                const sorted = tpbData.sort((a, b) => b.seeders - a.seeders);
                if (sorted[0] && sorted[0].info_hash) {
                    const encodedTitle = encodeURIComponent(title);
                    return `magnet:?xt=urn:btih:${sorted[0].info_hash}&dn=${encodedTitle}`;
                }
            }
        }
    } catch (error) {
        console.error(`Error fetching from TPB API: ${error.message}`);
    }

    return null;
  }

  async getOrCreateEngine(magnetLink: string) {
    if (this.engineCache.has(magnetLink)) {
      this.engineLastAccessed.set(magnetLink, Date.now());
      return this.engineCache.get(magnetLink)!;
    }

    const engine = torrentStream(magnetLink, {
      connections: this.config.connections,
      uploads: this.config.uploads,
    });

    this.engineCache.set(magnetLink, engine);
    this.engineLastAccessed.set(magnetLink, Date.now());

    return new Promise((resolve, reject) => {
      engine.on('ready', () => resolve(engine));
      engine.on('error', (err) => {
        this.engineCache.delete(magnetLink);
        this.engineLastAccessed.delete(magnetLink);
        reject(err);
      });
    });
  }

  async getOrCreateVideoFile(magnetLink: string) {
    if (this.videoFileCache.has(magnetLink)) {
      this.engineLastAccessed.set(magnetLink, Date.now());
      return this.videoFileCache.get(magnetLink) || null;
    }

    const engine = await this.getOrCreateEngine(magnetLink);
    let videoFile: any = null;

    // Find the largest video file for streaming (no download to disk)
    for (const file of engine.files) {
      const ext = path.extname(file.name).toLowerCase();
      if (!this.allowedExtensions.includes(ext)) continue;
      if (!videoFile || file.length > videoFile.length) {
        videoFile = file;
      }
    }

    if (!videoFile) {
      return null;
    }

    // Select file for streaming (creates read stream, no disk storage)
    videoFile.select();
    this.videoFileCache.set(magnetLink, videoFile);
    return videoFile;
  }

  private cleanupInactiveEngines(): void {
    const now = Date.now();
    for (const [magnetLink, lastAccessed] of this.engineLastAccessed.entries()) {
      if (now - lastAccessed > this.ENGINE_TTL) {
        const engine = this.engineCache.get(magnetLink);
        if (engine) {
          engine.destroy();
        }
        this.engineCache.delete(magnetLink);
        this.engineLastAccessed.delete(magnetLink);
        this.videoFileCache.delete(magnetLink);
      }
    }
  }

  onModuleDestroy(): void {
    clearInterval(this.cleanupInterval);
    for (const engine of this.engineCache.values()) {
      engine.destroy();
    }
  }
}
