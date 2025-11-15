import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { AuthnzService } from './authnz.service';
import { HttpPerformanceInterceptor, type AuthDto } from 'libs/shared';
import { Observable } from 'rxjs';
import { TokenDto } from 'libs/shared/dtos/token.dto';

@Controller('authnz')
export class AuthnzController {
  constructor(private readonly authnzService: AuthnzService) {}

  @Post('signin')
  @UseInterceptors(HttpPerformanceInterceptor)
  signIn(@Body() user: AuthDto): Observable<TokenDto> {
    return this.authnzService.signIn(user);
  }
}
