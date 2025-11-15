import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { HttpPerformanceInterceptor, type UserDto } from 'libs/shared';
import { RegisterService } from './register.service';
import { Observable } from 'rxjs';
import { TokenDto } from 'libs/shared/dtos/token.dto';

@Controller('register')
export class RegisterController {
  constructor(private readonly registerService: RegisterService) {}

  @Post()
  @UseInterceptors(HttpPerformanceInterceptor)
  register(@Body() user: UserDto): Observable<TokenDto> {
    return this.registerService.register(user);
  }
}
