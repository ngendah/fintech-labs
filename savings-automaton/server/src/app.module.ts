import { Module } from '@nestjs/common';
import { AppController } from 'src/app.controller';
import { AppService } from 'src/app.service';
import { CronModule } from 'src/cron/cron.module';
import { JengaModule } from 'src/partners/jenga/jenga.module';
import { ScheduleModule } from 'src/schedule/schedule.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [UserModule, ScheduleModule, JengaModule, CronModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
