import { Module } from '@nestjs/common';
import { CronService } from './cron.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ScheduleModule as NestScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [PrismaModule, NestScheduleModule.forRoot()],
  providers: [CronService],
})
export class CronModule {}
