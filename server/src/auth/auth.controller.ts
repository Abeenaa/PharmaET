import { Controller, Post, Body, Get, UseGuards, Request, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(loginDto);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Request() req): Promise<{ message: string }> {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new BadRequestException('No token provided');
    }
    await this.authService.logout(token);
    return { message: 'Logged out successfully' };
  }

  @Post('refresh-token')
  async refreshToken(
    @Body('refresh_token') refreshToken: string,
  ): Promise<AuthResponseDto> {
    if (!refreshToken) {
      throw new BadRequestException('Refresh token is required');
    }
    return this.authService.refreshToken(refreshToken);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getCurrentUser(@Request() req) {
    return this.authService.getCurrentUser(req.user.sub);
  }
}
