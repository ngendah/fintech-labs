import { Injectable } from '@nestjs/common';

@Injectable()
export class TransactionServiceService {
  getHello(): string {
    return 'Hello World!';
  }
}
