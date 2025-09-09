import { Injectable } from '@nestjs/common';

@Injectable()
export class WalletServiceService {
  getHello(): string {
    return 'Hello World!';
  }
}
