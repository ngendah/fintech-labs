import { Controller, HttpCode, Logger, Post } from '@nestjs/common';
import { NotificationService } from '../../services/notification/notification.service';

@Controller('wallet')
export class WalletController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post('balance')
  @HttpCode(200)
  balance() {
    this.notificationService.send({
      email: 'customer@email.com',
      message: 'You wallet balance is 10,000',
    });
  }
}
