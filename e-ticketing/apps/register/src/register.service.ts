import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AuthnzRepository, RegistrationRepository, User } from 'libs/shared';

@Injectable()
export class RegisterService {
  constructor(
    private readonly registrationRepository: RegistrationRepository,
    private readonly authnzRepository: AuthnzRepository,
  ) {}

  async register(user: {
    username: string;
    email: string;
    password: string;
  }): Promise<string> {
    if (await this.registrationRepository.get(user.email)) {
      throw new HttpException(`User already exists`, HttpStatus.FORBIDDEN);
    }
    if (!(await this.registrationRepository.new(user as User))) {
      throw new HttpException(
        `Unable to create new user`,
        HttpStatus.FORBIDDEN,
      );
    }
    return this.authnzRepository.authn(user.email, user.password);
  }
}
