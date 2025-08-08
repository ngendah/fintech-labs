import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from 'src/user/dto/user.dto';

export const CurrentUser = createParamDecorator(
  (_, ctx: ExecutionContext): User => {
    const request = ctx.switchToHttp().getRequest();
    return { id: request.user.sub, name: request.user.name };
  },
);
