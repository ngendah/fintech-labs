import { Body, Controller, Post } from '@nestjs/common';
import { type UserDto } from 'libs/shared';
import { RegisterService } from './register.service';
import { Observable } from 'rxjs';

@Controller('register')
export class RegisterController {
  constructor(private readonly registerService: RegisterService) {}

  @Post()
  register(@Body() user: UserDto): Observable<string> {
    return this.registerService.register(user);
  }
}
