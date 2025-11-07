import { Inject, Injectable } from '@nestjs/common';
import { ClientNats } from '@nestjs/microservices';
import { EndPoint, REGISTER_SERVICE, UserDto } from 'libs/shared';
import { Observable } from 'rxjs';

@Injectable()
export class RegisterService {
  constructor(@Inject(REGISTER_SERVICE) private readonly client: ClientNats) {}

  register(user: UserDto): Observable<string> {
    return this.client.send<string>(EndPoint.REGISTER, user);
  }
}
