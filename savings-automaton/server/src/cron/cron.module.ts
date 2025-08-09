import { Module } from '@nestjs/common';
import { CronService } from './cron.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ScheduleModule as NestScheduleModule } from '@nestjs/schedule';
import { JengaModule } from 'src/partners/jenga/jenga.module';

@Module({
  imports: [PrismaModule, NestScheduleModule.forRoot(), JengaModule],
  providers: [CronService],
})
export class CronModule {}
