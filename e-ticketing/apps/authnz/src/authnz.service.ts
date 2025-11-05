import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthnzService {
  getHello(): string {
    return 'Hello World!';
  }
}
