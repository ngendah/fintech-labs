import {
  Body,
  Controller,
  createParamDecorator,
  ExecutionContext,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../authnz/authnz.guard';
import { type PayResultDto, type PayDto, type UserDocument } from 'libs/shared';
import { Observable } from 'rxjs';
import { PaymentsService } from './payments.service';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentService: PaymentsService) {}

  @UseGuards(AuthGuard)
  @Post('collect')
  collect(@Body() pay: PayDto, @User() user: UserDocument): Observable<string> {
    return this.paymentService.collect({ ...pay, userId: user._id.toString() });
  }

  @Post('on-collect')
  onCollect(@Body() payResults: PayResultDto) {
    this.paymentService.confirmation(payResults);
  }
}
