import {
  Body,
  Controller,
  Logger,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { KycService } from '../../services/kyc/kyc.service';

@Controller('user')
export class UserController {
  private readonly logger = new Logger(UserController.name);
  constructor(private readonly kycService: KycService) { }

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  knowYourCustomer(@Body() documents: Record<string, any>) {
    this.logger.debug(`money transfer: ${JSON.stringify(documents)}`);
    this.kycService.review(documents);
    return {
      message: `Thank you sending your documents.
      'Well review them and get back to you shortly, via email`,
    };
  }
}
