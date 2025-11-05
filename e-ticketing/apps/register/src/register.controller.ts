import { Controller, Get } from '@nestjs/common';
import { RegisterService } from './register.service';

@Controller()
export class RegisterController {
  constructor(private readonly registerService: RegisterService) {}

  @Get()
  getHello(): string {
    return this.registerService.getHello();
  }
}
