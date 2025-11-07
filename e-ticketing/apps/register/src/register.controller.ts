import { Controller } from '@nestjs/common';
import { RegisterService } from './register.service';
import { MessagePattern } from '@nestjs/microservices';
import { EndPoint, type UserDto } from 'libs/shared';

@Controller()
export class RegisterController {
  constructor(private readonly registerService: RegisterService) {}

  @MessagePattern(EndPoint.REGISTER)
  register(user: UserDto): Promise<string> {
    return this.registerService.register(user);
  }
}
