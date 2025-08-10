import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { existsSync } from 'fs';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Enable CORS with comprehensive configuration for web and mobile
  app.enableCors({
    origin: [
      'https://laughing-yodel-qgwgv7q949vhxjrg-3000.app.github.dev', 
      'https://laughing-yodel-qgwgv7q949vhxjrg-3001.app.github.dev',
      'http://localhost:8080',  // Flutter web dev server
      'http://localhost:50505', // Flutter web dev server alternative
      'http://localhost:58514', // Flutter web dev server alternative
      'http://127.0.0.1:3000',
      'http://127.0.0.1:3001',
      'http://10.52.84.210:3000', 
      'http://10.52.84.210:3001'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: false, // Set to false for simplicity
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With', 'Cache-Control', 'Range'],
    exposedHeaders: ['Content-Length', 'Content-Range'],
    optionsSuccessStatus: 200
  });

  // Enable cookie parsing
  app.use(cookieParser());

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
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    
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
  console.log(`Backend is running on: https://laughing-yodel-qgwgv7q949vhxjrg-3001.app.github.dev`);
  console.log(`Backend is also accessible on: http://10.52.84.210:3001`);
}
bootstrap();

