import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TMDBService } from './tmdb.service';
import { OMDBService } from './omdb.services';
import { YTSService } from './yts.services';
import { TorrentEngineCacheService } from './torrentEngine.service';
import { Movie, MovieDocument } from './schemas/movie.schema';
import { Request, Response } from 'express';
import * as ffmpeg from 'fluent-ffmpeg';
import * as path from 'path';
import * as pump from 'pump';


@Injectable()
export class MovieService {
  private readonly validExtensions = ['.mp4', '.webm', '.ogg', '.mkv'];
  
  constructor(
    @InjectModel(Movie.name) private movieModel: Model<MovieDocument>,
    private readonly TMDBservice: TMDBService,
    private readonly OMDBservice: OMDBService,
    private readonly YTSservice: YTSService,
    private readonly torrentEngineCacheService: TorrentEngineCacheService
  ) {}

  async create(movieId: string) {
    const newMovie = new this.movieModel({id: movieId});
    return await newMovie.save();
  }

  async findAll(id: string, page: number) {
    // Handle anonymous users - use default language 'en'
    const language = 'en'; // Always use English for anonymous users
    return await this.TMDBservice.fetchAllMovies(language, page);
  }

  async findOne(userId: string, id: string): Promise<any> {
    // Handle anonymous users - use default language 'en'  
    const language = 'en'; // Always use English for anonymous users
    
    const movieData = await this.TMDBservice.fetchMovie(id, language);
    const existingMovie = await this.movieModel.findOne({ id: id }).exec();
    if (!existingMovie) {
      return { movieData };
    }
    return { movieData };
  }

  // Add a new method for filtering movies with anonymous user support
  async filterMovies(userId: string, filterDto: any) {
    // Handle anonymous users - use default language 'en'
    const language = 'en'; // Always use English for anonymous users
    
    // Use TMDBService to filter movies - you may need to implement this method
    return await this.TMDBservice.filterMovies(filterDto, language);
  }

  async streamMovie(imdbID: string, title: string, quality: string, req: Request, res: Response): Promise<void> {
    // Log request for debugging (removed user authentication requirement)
    console.log('Stream request for:', { imdbID, title, quality });
    console.log('User-Agent:', req.headers['user-agent']);
    console.log('Range header:', req.headers.range);
    
    // REMOVED: Authentication check - now allows anonymous access
    
    const magnetLink = await this.torrentEngineCacheService.getOrFetchMagnetLink(imdbID, title, quality);
    if (!magnetLink) {
      throw new BadRequestException('Could not find magnet link for this movie');
    }

    const videoFile = await this.torrentEngineCacheService.getOrCreateVideoFile(magnetLink);

    if (!videoFile) {
      throw new NotFoundException('No video file found in torrent');
    }

    const fileSize = videoFile.length;
    const fileExt = path.extname(videoFile.name).toLowerCase();
    const range = req.headers.range;
    const userAgent = req.headers['user-agent'] || '';
    const isIOS = userAgent.includes('iPhone') || userAgent.includes('iPad') || userAgent.includes('iOS');
    const isSafari = userAgent.includes('Safari') && !userAgent.includes('Chrome');

    console.log('Device detection:', { isIOS, isSafari, userAgent });

    // iOS Safari requires range header
    if (!range) {
      // For iOS Safari, send full file size info
      if (isIOS || isSafari) {
        res.writeHead(200, {
          'Content-Length': fileSize,
          'Content-Type': 'video/mp4',
          'Accept-Ranges': 'bytes',
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Range',
          'Access-Control-Expose-Headers': 'Content-Range, Content-Length, Accept-Ranges',
        });
        
        const stream = videoFile.createReadStream();
        return pump(stream, res, (err) => {
          if (err) {
            console.error('Full streaming error:', err);
          }
        });
      } else {
        throw new BadRequestException('Range header required');
      }
    }

    // Parse range header
    const parts = range.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    let end: number;

    if (parts[1]) {
      end = parseInt(parts[1], 10);
    } else {
      // iOS Safari often sends "bytes=0-" which means from 0 to end
      // We need to handle this differently for iOS
      if (isIOS || isSafari) {
        // For iOS, send a reasonable chunk size but not too big
        end = Math.min(start + 1024 * 1024 - 1, fileSize - 1); // 1MB for iOS
      } else {
        // For other browsers, use 2MB chunks
        end = Math.min(start + 2 * 1024 * 1024 - 1, fileSize - 1);
      }
    }

    // Ensure end doesn't exceed file size
    end = Math.min(end, fileSize - 1);
    const chunkSize = end - start + 1;

    console.log('Streaming range:', { start, end, chunkSize, fileSize, isIOS });

    // iOS Safari specific headers
    const headers: any = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunkSize,
      'Content-Type': 'video/mp4',
      'Cache-Control': 'no-cache',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Range',
      'Access-Control-Expose-Headers': 'Content-Range, Content-Length, Accept-Ranges',
    };

    // Additional headers for iOS Safari
    if (isIOS || isSafari) {
      headers['Connection'] = 'keep-alive';
      headers['X-Content-Type-Options'] = 'nosniff';
    }

    res.writeHead(206, headers);

    const stream = videoFile.createReadStream({ start, end });

    if (!this.validExtensions.includes(fileExt)) {
      ffmpeg(stream)
        .on('start', () => console.log('FFmpeg conversion started'))
        .on('error', (error) => console.error('FFmpeg error:', error.message))
        .format('mp4')
        .audioBitrate(128)
        .audioCodec('aac')
        .videoBitrate(1024)
        .videoCodec('libx264')
        .outputOptions(['-movflags frag_keyframe+empty_moov'])
        .pipe(res, { end: true });
    } else {
      pump(stream, res, (err) => {
        if (err) {
          console.error('Streaming error:', err);
        }
      });
    }
  }

   async search( title: string) {
    const [result, _, __] = await Promise.all([
    this.TMDBservice.searchMovies(title),
    this.OMDBservice.searchMovies(title),
    this.YTSservice.searchMovies(title),
    ]);
    return result
  }

  async prepareStream(imdbID: string, title: string, quality: string): Promise<boolean> {
    try {
      // Get the magnet link
      const magnetLink = await this.torrentEngineCacheService.getOrFetchMagnetLink(imdbID, title, quality);
      if (!magnetLink) {
        throw new BadRequestException('Could not find magnet link for this movie');
      }

      // Initiate torrent engine (no download required for streaming)
      const videoFile = await this.torrentEngineCacheService.getOrCreateVideoFile(magnetLink);
      if (!videoFile) {
        throw new NotFoundException('No video file found in torrent');
      }

      // For direct streaming, we're ready as soon as the torrent engine is connected
      console.log(`Stream ready for ${title}: Direct streaming mode`);
      
      return true; // Always ready for direct streaming
    } catch (error) {
      console.error('Error preparing stream:', error);
      throw error;
    }
  }

  async getSubtitle(imdbID: string, title: string, req: Request, res: Response): Promise<void> {
    try {
      // Get the magnet link - try different qualities if needed
      const qualities = ['720p', '1080p', '480p'];
      let magnetLink: string | null = null;
      
      for (const quality of qualities) {
        const link = await this.torrentEngineCacheService.getOrFetchMagnetLink(imdbID, title, quality);
        if (link) {
          magnetLink = link;
          break;
        }
      }
      
      if (!magnetLink) {
        res.status(404).send('No torrent found for this movie');
        return;
      }

      // Get the engine and check for subtitle files
      const engine = await this.torrentEngineCacheService.getOrCreateEngine(magnetLink);
      
      // Look for subtitle files
      let subtitleFile = engine.files.find(file => {
        const name = file.name.toLowerCase();
        return name.endsWith('.srt') || name.endsWith('.vtt');
      });
      
      if (!subtitleFile) {
        res.status(404).send('No subtitle file found');
        return;
      }
      

      // Set content type header
      const isVtt = subtitleFile.name.toLowerCase().endsWith('.vtt');
      res.setHeader('Content-Type', isVtt ? 'text/vtt; charset=utf-8' : 'text/vtt; charset=utf-8');
      
      // Set cache control (CORS headers are handled globally)
      res.setHeader('Cache-Control', 'public, max-age=3600');
      
      // Create a readable stream from the subtitle file
      const stream = subtitleFile.createReadStream();
      
      // If SRT, convert to VTT on the fly
      if (!isVtt) {
        res.write('WEBVTT\n\n');
        let buffer = '';

        stream.on('data', (chunk) => {
          buffer += chunk.toString();
          const lines = buffer.split('\n');
          
          if (lines.length > 3) {
            for (let i = 0; i < lines.length - 3; i++) {
              const line = lines[i].trim();
              
              // Skip empty lines and number-only lines
              if (line === '' || /^\d+$/.test(line)) {
                continue;
              }
              
              // Handle timestamp lines - replace ALL commas with periods for proper WebVTT format
              if (line.includes('-->')) {
                res.write(line.replace(/,/g, '.') + '\n');
              } else {
                // Text content - add proper spacing after each subtitle line
                res.write(line + '\n\n');
              }
            }
            
            buffer = lines.slice(-3).join('\n');
          }
        });

        stream.on('end', () => {
          // Write any remaining content
          const lines = buffer.split('\n');
          for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed && !/^\d+$/.test(trimmed)) {
              if (trimmed.includes('-->')) {
                res.write(trimmed.replace(/,/g, '.') + '\n');
              } else {
                res.write(trimmed + '\n\n');
              }
            }
          }
          res.end();
        });
      } else {
        // If already VTT, just pipe it through
        stream.pipe(res);
      }
    } catch (error) {
      console.error('Error serving subtitle:', error);
      res.status(500).send('Error serving subtitle');
    }
  }

}
