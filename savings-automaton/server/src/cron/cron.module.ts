import { Module } from '@nestjs/common';
import { ScheduleModule as NestScheduleModule } from '@nestjs/schedule';
import { JengaModule } from 'src/partners/jenga/jenga.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CronService } from './cron.service';

@Module({
  imports: [PrismaModule, NestScheduleModule.forRoot(), JengaModule],
  providers: [CronService],
})
export class CronModule {}
