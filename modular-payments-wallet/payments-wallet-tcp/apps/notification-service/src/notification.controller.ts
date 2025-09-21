import { Controller, Logger } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { notificationSendEndpoint } from 'lib/common';

@Controller()
export class NotificationServiceController {
  private readonly logger = new Logger(NotificationServiceController.name);
  constructor() {}

  @EventPattern(notificationSendEndpoint)
  async send(notification: { message: string; email: string }) {
    this.logger.debug(`sending balance notification to ${notification.email}`);
  }
}
