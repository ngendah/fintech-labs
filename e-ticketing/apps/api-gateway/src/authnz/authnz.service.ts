import { Inject, Injectable } from '@nestjs/common';
import { ClientNats } from '@nestjs/microservices';
import { AuthDto, AUTHNZ_SERVICE, EndPoint, UserDocument } from 'libs/shared';
import { Observable } from 'rxjs';
import { rpcErrorInterceptor } from '../exception-filter';

@Injectable()
export class AuthnzService {
  constructor(@Inject(AUTHNZ_SERVICE) private readonly client: ClientNats) {}

  signIn(user: AuthDto): Observable<string> {
    return this.client
      .send<string>(EndPoint.AUTHN, user)
      .pipe(rpcErrorInterceptor());
  }

  verifyToken(token: string): Observable<UserDocument> {
    return this.client
      .send<UserDocument>(EndPoint.AUTHN_VERIFY_TOKEN, token)
      .pipe(rpcErrorInterceptor());
  }
}
