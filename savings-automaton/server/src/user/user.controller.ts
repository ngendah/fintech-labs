import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from 'src/user/dto/createUser.dto';
import { LogInUserDto } from 'src/user/dto/logInUser.dto';
import { JwtService } from '@nestjs/jwt';

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  @Post()
  signUp(@Body() data: CreateUserDto) {
    this.userService.create(data);
  }

  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() data: LogInUserDto) {
    const user = await this.userService.signIn(data);
    if (!user) {
      throw new UnauthorizedException();
    }
    const payload = { sub: user.id, name: user.name };
    const token = await this.jwtService.signAsync(payload);
    return { token };
  }
}
