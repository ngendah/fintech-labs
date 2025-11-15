import { Controller } from '@nestjs/common';
import { AuthnzService } from './authnz.service';
import { MessagePattern } from '@nestjs/microservices';
import { type AuthDto, EndPoint, UserDocument } from 'libs/shared';
import { TokenDto } from 'libs/shared/dtos/token.dto';

@Controller()
export class AuthnzController {
  constructor(private readonly authnzService: AuthnzService) {}

  @MessagePattern(EndPoint.AUTHN)
  authn(user: AuthDto): Promise<TokenDto> {
    return this.authnzService.authn(user);
  }

  @MessagePattern(EndPoint.AUTHN_VERIFY_TOKEN)
  verify(token: string): Promise<UserDocument> {
    return this.authnzService.verifyToken(token);
  }
}
