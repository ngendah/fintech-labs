import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

const JwtAuthModule = JwtModule.register({
  global: true,
  secret: 'supersecret',
  signOptions: { expiresIn: '60s' },
});

@Module({
  imports: [JwtAuthModule],
  exports: [JwtAuthModule],
})
export class AuthModule {}
