import { Injectable } from '@nestjs/common';
import { AuthDto, AuthnzRepository, UserDocument } from 'libs/shared';
import { TokenDto } from 'libs/shared/dtos/token.dto';

@Injectable()
export class AuthnzService {
  constructor(private readonly authnzRepository: AuthnzRepository) {}

  authn(user: AuthDto): Promise<TokenDto> {
    return this.authnzRepository.authn(user.email, user.password);
  }

  verifyToken(token: string): Promise<UserDocument> {
    return this.authnzRepository.verifyToken(token);
  }
}
