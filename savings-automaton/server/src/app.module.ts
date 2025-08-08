import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from 'src/app.service';
import { UserModule } from 'src/user/user.module';
import { ScheduleModule } from 'src/schedule/schedule.module';

@Module({
  imports: [UserModule, ScheduleModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
