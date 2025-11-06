import { Controller, Get, Post } from '@nestjs/common';
import { RegisterService } from './register.service';
import { MessagePattern } from '@nestjs/microservices';
import { EndPoint } from 'libs/shared';

@Controller()
export class RegisterController {
  constructor(private readonly registerService: RegisterService) {}

  @MessagePattern(EndPoint.REGISTER)
  register(user: {
    username: string;
    email: string;
    password: string;
  }): Promise<string> {
    return this.registerService.register(user);
  }
}
