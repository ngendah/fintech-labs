import { Injectable } from '@nestjs/common';
import { AuthDto, AuthnzRepository } from 'libs/shared';

@Injectable()
export class AuthnzService {
  constructor(private readonly authnzRepository: AuthnzRepository) {}

  authn(user: AuthDto): Promise<string> {
    return this.authnzRepository.authn(user.email, user.password);
  }
}
