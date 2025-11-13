import { Inject, Injectable } from '@nestjs/common';
import { ClientNats } from '@nestjs/microservices';
import {
  EndPoint,
  PAYMENT_SERVICE,
  PayResultDto,
  UserPayDto,
} from 'libs/shared';
import { Observable } from 'rxjs';
import { rpcErrorInterceptor } from '../exception-filter';

@Injectable()
export class PaymentsService {
  constructor(@Inject(PAYMENT_SERVICE) private readonly client: ClientNats) {}

  collect(pay: UserPayDto): Observable<string> {
    return this.client.send<string>(EndPoint.PAY, pay);
  }

  confirmation(payResult: PayResultDto) {
    return this.client
      .send<void>(EndPoint.PAYMENT_RESULTS, payResult)
      .pipe(rpcErrorInterceptor());
  }
}
