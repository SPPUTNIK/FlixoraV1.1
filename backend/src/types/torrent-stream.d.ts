declare module 'torrent-stream' {
  interface TorrentFile {
    name: string;
    length: number;
    select: () => void;
    createReadStream: (options?: { start?: number; end?: number }) => NodeJS.ReadableStream;
  }

  interface TorrentEngine {
    files: TorrentFile[];
    destroy: () => void;
    on: (event: string, callback: (...args: any[]) => void) => void;
  }

  function torrentStream(magnetLink: string, options?: object): TorrentEngine;

  export = torrentStream;
}
