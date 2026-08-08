import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'dev-secret',
      signOptions: { expiresIn: parseInt(process.env.JWT_EXPIRATION || '3600', 10) },
    }),
  ],
  providers: [],
  exports: [],
})
export class AuthModule {}
