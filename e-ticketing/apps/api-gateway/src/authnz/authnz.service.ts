import { Inject, Injectable } from '@nestjs/common';
import { ClientNats } from '@nestjs/microservices';
import { AuthDto, AUTHNZ_SERVICE, EndPoint } from 'libs/shared';
import { Observable } from 'rxjs';

@Injectable()
export class AuthnzService {
  constructor(@Inject(AUTHNZ_SERVICE) private readonly client: ClientNats) {}

  signIn(user: AuthDto): Observable<string> {
    return this.client.send<string>(EndPoint.AUTHN, user);
  }
}
