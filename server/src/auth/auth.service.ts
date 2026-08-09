import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DatabaseService } from '@/database/database.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto } from './dto/auth-response.dto';

const TOKEN_BLACKLIST = new Set<string>();

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private db: DatabaseService,
  ) {}

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    // Find user by email
    const user = await this.db.user.findUnique({
      where: { email: loginDto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (!user.is_active) {
      throw new UnauthorizedException('User account is disabled');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password_hash,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Generate tokens
    const access_token = this.jwtService.sign(
      {
        sub: user.id,
        email: user.email,
        role: user.role,
        branch_id: user.branch_id,
      },
      { expiresIn: '1h' },
    );

    const refresh_token = this.jwtService.sign(
      {
        sub: user.id,
        type: 'refresh',
      },
      { expiresIn: '7d' },
    );

    return {
      access_token,
      refresh_token,
      expires_in: 3600,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async validateToken(token: string): Promise<any> {
    try {
      // Check if token is blacklisted
      if (TOKEN_BLACKLIST.has(token)) {
        throw new UnauthorizedException('Token has been revoked');
      }

      return this.jwtService.verify(token);
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  async logout(token: string): Promise<void> {
    try {
      this.jwtService.verify(token);
      // Add token to blacklist
      TOKEN_BLACKLIST.add(token);
    } catch (error) {
      throw new BadRequestException('Invalid token');
    }
  }

  async refreshToken(refreshToken: string): Promise<AuthResponseDto> {
    try {
      const decoded = this.jwtService.verify(refreshToken);

      if (decoded.type !== 'refresh') {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const user = await this.db.user.findUnique({
        where: { id: decoded.sub },
      });

      if (!user || !user.is_active) {
        throw new UnauthorizedException('User not found or inactive');
      }

      // Generate new access token
      const access_token = this.jwtService.sign(
        {
          sub: user.id,
          email: user.email,
          role: user.role,
          branch_id: user.branch_id,
        },
        { expiresIn: '1h' },
      );

      return {
        access_token,
        refresh_token: refreshToken,
        expires_in: 3600,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async getCurrentUser(userId: string) {
    const user = await this.db.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      branch_id: user.branch_id,
      is_active: user.is_active,
    };
  }
}
