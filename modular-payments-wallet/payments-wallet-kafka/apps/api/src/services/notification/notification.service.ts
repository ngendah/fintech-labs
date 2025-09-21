import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { NOTIFICATION_SERVICE, notificationSendEndpoint } from 'lib/common';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);
  constructor(
    @Inject(NOTIFICATION_SERVICE)
    private readonly client: ClientKafka,
  ) {}

  async send(notification: { message: string; email: string }) {
    this.client
      .emit(notificationSendEndpoint, notification)
      .subscribe((results) => {});
  }
}
