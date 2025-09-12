import { Module } from '@nestjs/common';
import { NotificationServiceController } from './notification.controller';

@Module({
  imports: [],
  controllers: [NotificationServiceController],
})
export class NotificationServiceModule {}
