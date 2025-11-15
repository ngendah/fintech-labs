import { Body, Controller, Post } from '@nestjs/common';
import { AuthnzService } from './authnz.service';
import { type AuthDto } from 'libs/shared';
import { Observable } from 'rxjs';
import { TokenDto } from 'libs/shared/dtos/token.dto';

@Controller('authnz')
export class AuthnzController {
  constructor(private readonly authnzService: AuthnzService) {}

  @Post('signin')
  signIn(@Body() user: AuthDto): Observable<TokenDto> {
    return this.authnzService.signIn(user);
  }
}
