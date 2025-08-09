import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User, UserSchema } from './schemas/user.schema';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join} from 'path';

const uploadDir = join(process.cwd(), 'uploads')

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
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
          fileSize: 1 * 1024 * 1024, // 1 MB size limit
        },
      }),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService], // 👈 So AuthModule can use it
})
export class UserModule {}
