import { Controller, UseInterceptors } from '@nestjs/common';
import { RegisterService } from './register.service';
import { MessagePattern } from '@nestjs/microservices';
import {
  EndPoint,
  MicroservicePerformanceInterceptor,
  type UserDto,
} from 'libs/shared';
import { TokenDto } from 'libs/shared/dtos/token.dto';

@Controller()
export class RegisterController {
  constructor(private readonly registerService: RegisterService) {}

  @MessagePattern(EndPoint.REGISTER)
  @UseInterceptors(MicroservicePerformanceInterceptor)
  register(user: UserDto): Promise<TokenDto> {
    return this.registerService.register(user);
  }
}
