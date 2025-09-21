import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { NOTIFICATION_SERVICE, notificationSendEndpoint } from 'lib/common';

@Injectable()
export class NotificationService {
  constructor(
    @Inject(NOTIFICATION_SERVICE)
    private readonly client: ClientKafka,
  ) {}

  async send(notification: { message: string; email: string }) {
    this.client.emit(notificationSendEndpoint, notification);
  }
}
