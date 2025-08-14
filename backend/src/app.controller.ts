import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller()
export class AppController {
  @Get()
  @ApiOperation({ summary: 'API Root' })
  @ApiResponse({ status: 200, description: 'API is running' })
  getRoot() {
    return {
      message: 'FLIXORA API is running',
      version: '1.0.0',
      anonymous: true,
      timestamp: new Date().toISOString()
    };
  }

  @Get('health')
  @ApiOperation({ summary: 'Health Check' })
  @ApiResponse({ status: 200, description: 'API health status' })
  getHealth() {
    return {
      status: 'OK',
      message: 'FLIXORA API is healthy',
      anonymous: true,
      timestamp: new Date().toISOString()
    };
  }
}
