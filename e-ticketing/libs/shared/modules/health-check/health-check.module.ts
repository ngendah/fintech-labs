import { Module } from '@nestjs/common';
import { HealthCheckController } from './health-check.controller';
import { ConfigModule } from '@nestjs/config';
import { TerminusModule } from '@nestjs/terminus';

@Module({
  imports: [ConfigModule.forRoot(), TerminusModule],
  controllers: [HealthCheckController],
})
export class HealthCheckModule {}
