import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MovieService } from './movie.service';
import { MovieController } from './movie.controller';
import { Movie, MovieSchema } from './schemas/movie.schema';
import { TMDBService } from './tmdb.service';
import { OMDBService } from './omdb.services';
import { YTSService } from './yts.services';  
import { TorrentEngineCacheService } from './torrentEngine.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Movie.name, schema: MovieSchema }]),
  ],
  controllers: [MovieController],
  providers: [MovieService, TMDBService, OMDBService, YTSService, TorrentEngineCacheService],
  exports: [ MongooseModule ]
})
export class MovieModule {}
