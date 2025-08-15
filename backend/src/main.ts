import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { existsSync } from 'fs';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Enable CORS with flixora.uk configuration
  app.enableCors({
    origin: [
      'https://flixora.uk',
      'https://flixora.uk:80',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: false, // Anonymous access - no credentials needed
    allowedHeaders: ['Content-Type', 'Accept', 'Origin', 'X-Requested-With', 'Cache-Control', 'Range'],
    exposedHeaders: ['Content-Length', 'Content-Range'],
    optionsSuccessStatus: 200
  });

  // Debug the uploads path
  const uploadsPath = join(process.cwd(), 'uploads');
  
  if (existsSync(uploadsPath)) {
    const fs = require('fs');
    const files = fs.readdirSync(uploadsPath);
  }

  // Add CORS middleware for static files
  app.use('/uploads', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    
    if (req.method === 'OPTIONS') {
      res.sendStatus(200);
    } else {
      next();
    }
  });

  // Serve static files from uploads directory
  app.useStaticAssets(uploadsPath, {
    prefix: '/uploads/',
  });

  // Enable global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strips properties not in DTO
      forbidNonWhitelisted: true, // throws error for unknown properties
      transform: true, // auto-transform payloads to DTO instances
    }),
  );

  const config = new DocumentBuilder()
    .setTitle("Hypertube")
    .setDescription('App for streaming Videos')
    .setVersion('1.0')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);
  
  // Listen on all interfaces
  await app.listen(3001, '0.0.0.0');
}
bootstrap();

