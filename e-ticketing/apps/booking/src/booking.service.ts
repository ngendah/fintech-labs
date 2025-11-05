import { Injectable } from '@nestjs/common';

@Injectable()
export class BookingService {
  getHello(): string {
    return 'Hello World!';
  }
}
