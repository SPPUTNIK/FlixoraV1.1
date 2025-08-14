import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { MovieModule } from './movie/movie.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(
      process.env.MONGODB_URI || 
      'mongodb://hypertubeUser:appPass@db:27017/hypertube?authSource=hypertube'
    ),
    MovieModule,
  ],
  controllers: [AppController],
})
export class AppModule {}

