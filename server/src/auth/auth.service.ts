import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DatabaseService } from '@/database/database.service';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto } from './dto/auth-response.dto';

const TOKEN_BLACKLIST = new Set<string>();
const PASSWORD_RESET_TOKENS = new Map<string, { userId: string; expiresAt: number }>();

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
        requires_password_change: user.requires_password_change,
      },
    };
  }

  async forgotPassword(email: string): Promise<{ message: string }> {
    // Check if user exists (but don't reveal this info)
    const user = await this.db.user.findUnique({
      where: { email },
    });

    if (user && user.is_active) {
      // Generate reset token (valid for 1 hour)
      const resetToken = crypto.randomBytes(32).toString('hex');
      const expiresAt = Date.now() + 3600000; // 1 hour

      PASSWORD_RESET_TOKENS.set(resetToken, { userId: user.id, expiresAt });

      // TODO: Send email with reset link
      // const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
      // await this.emailService.sendPasswordResetEmail(user.email, resetLink);

      console.log(`Reset token for ${email}: ${resetToken}`);
    }

    // Always return generic message for security
    return {
      message: 'If an account exists with this email address, password reset instructions have been sent.',
    };
  }

  async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
    const resetData = PASSWORD_RESET_TOKENS.get(token);

    if (!resetData) {
      throw new BadRequestException('Invalid or expired reset link.');
    }

    if (resetData.expiresAt < Date.now()) {
      PASSWORD_RESET_TOKENS.delete(token);
      throw new BadRequestException('Reset link has expired. Please request a new one.');
    }

    const user = await this.db.user.findUnique({
      where: { id: resetData.userId },
    });

    if (!user) {
      PASSWORD_RESET_TOKENS.delete(token);
      throw new BadRequestException('User not found.');
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password and clear the requires_password_change flag if it was set
    await this.db.user.update({
      where: { id: user.id },
      data: {
        password_hash: hashedPassword,
        requires_password_change: false,
      },
    });

    // Invalidate the token
    PASSWORD_RESET_TOKENS.delete(token);

    return { message: 'Password has been reset successfully.' };
  }

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<{ message: string }> {
    const user = await this.db.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password_hash,
    );

    if (!isPasswordValid) {
      throw new BadRequestException('Current password is incorrect.');
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password and clear the requires_password_change flag
    await this.db.user.update({
      where: { id: userId },
      data: {
        password_hash: hashedPassword,
        requires_password_change: false,
      },
    });

    return { message: 'Password has been changed successfully.' };
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
          requires_password_change: user.requires_password_change,
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
      requires_password_change: user.requires_password_change,
    };
  }
}
