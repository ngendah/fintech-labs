import { Injectable } from '@nestjs/common';

@Injectable()
export class FraudDetectionServiceService {
  getHello(): string {
    return 'Hello World!';
  }
}
