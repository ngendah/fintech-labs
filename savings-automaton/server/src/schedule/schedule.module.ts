import { Module } from '@nestjs/common';
import { ScheduleController } from 'src/schedule/schedule.controller';
import { ScheduleService } from 'src/schedule/schedule.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [ScheduleController],
  providers: [ScheduleService],
})
export class ScheduleModule {}
