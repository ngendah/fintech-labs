import { Injectable } from '@nestjs/common';

@Injectable()
export class KycServiceService {
  getHello(): string {
    return 'Hello World!';
  }
}
