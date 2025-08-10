import { Module } from '@nestjs/common';
import { AppService } from 'src/app.service';
import { ScheduleModule } from 'src/schedule/schedule.module';
import { UserModule } from 'src/user/user.module';
import { AppController } from './app.controller';

@Module({
  imports: [UserModule, ScheduleModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
