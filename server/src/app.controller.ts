import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  health() {
    return {
      message: 'Server is running',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }

  @Get('health')
  healthCheck() {
    return {
      status: 'ok',
      message: 'PharmaET API is running',
      version: '1.0.0',
    };
  }
}
