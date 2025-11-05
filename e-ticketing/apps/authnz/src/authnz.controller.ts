import { Controller, Get } from '@nestjs/common';
import { AuthnzService } from './authnz.service';

@Controller()
export class AuthnzController {
  constructor(private readonly authnzService: AuthnzService) {}

  @Get()
  getHello(): string {
    return this.authnzService.getHello();
  }
}
