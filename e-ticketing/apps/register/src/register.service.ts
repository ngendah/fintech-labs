import { Injectable } from '@nestjs/common';
import {
  AuthnzRepository,
  RegistrationRepository,
  User,
  UserDto,
} from 'libs/shared';
import {
  MicroServiceException,
  RpcExceptionCode,
} from 'libs/shared/rpc-exception';

@Injectable()
export class RegisterService {
  constructor(
    private readonly registrationRepository: RegistrationRepository,
    private readonly authnzRepository: AuthnzRepository,
  ) {}

  async register(user: UserDto): Promise<string> {
    if (await this.registrationRepository.get(user.email)) {
      throw new MicroServiceException(
        `User already exists`,
        RpcExceptionCode.USER_EXISTS,
      );
    }
    if (!(await this.registrationRepository.new(user as User))) {
      throw new MicroServiceException(
        `Unable to create new user`,
        RpcExceptionCode.INVALID_CREDENTIALS,
      );
    }
    return this.authnzRepository.authn(user.email, user.password);
  }
}
