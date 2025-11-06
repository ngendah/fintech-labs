import { Controller } from '@nestjs/common';
import { AuthnzService } from './authnz.service';
import { MessagePattern } from '@nestjs/microservices';
import { EndPoint } from 'libs/shared';

@Controller()
export class AuthnzController {
  constructor(private readonly authnzService: AuthnzService) {}

  @MessagePattern(EndPoint.AUTHN)
  authn(user: { email: string; password: string }): Promise<string> {
    return this.authnzService.authn(user);
  }
}
