import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { jwtConstants } from './constants';
import { FortyTwoStrategy } from './strategies/fortytwo.strategy';
import { GoogleStrategy } from './strategies/google.strategy';
import { EmailService } from './email.service';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';

const uploadDir = join(process.cwd(), 'uploads');

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1d' },
    }),
    MulterModule.register({
      storage: diskStorage({
        destination: (req, file, cb) => {
          cb(null, uploadDir);
        },
        filename: (req, file, cb) => {
          const ext = extname(file.originalname);
          const filename = `${Date.now()}${ext}`;
          cb(null, filename);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
          cb(null, true);
        } else {
          cb(new Error('Only JPEG and PNG images are allowed.'), false);
        }
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, FortyTwoStrategy, GoogleStrategy, EmailService],
})
export class AuthModule {}