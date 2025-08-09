import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { MovieModule } from './movie/movie.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(
      process.env.MONGODB_URI || 
      'mongodb://hypertubeUser:appPass@db:27017/hypertube?authSource=hypertube'
    ),
    AuthModule,
    UserModule,
    MovieModule,
  ],
})
export class AppModule {}

