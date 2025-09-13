import { Module } from '@nestjs/common';
import { NotificationServiceController } from './notification.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  controllers: [NotificationServiceController],
})
export class NotificationServiceModule { }
