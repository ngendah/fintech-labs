import { Injectable } from '@nestjs/common';
import { AuthnzRepository } from 'libs/shared';
import {
  MicroServiceException,
  RpcExceptionCode,
} from 'libs/shared/rpc-exception';

@Injectable()
export class AuthnzService {
  constructor(private readonly authnzRepository: AuthnzRepository) {}

  async authn(user: { email: string; password: string }): Promise<string> {
    try {
      const token = await this.authnzRepository.authn(
        user.email,
        user.password,
      );
      return token;
    } catch (error) {
      throw new MicroServiceException(
        error,
        RpcExceptionCode.INVALID_CREDENTIALS,
      );
    }
  }
}
