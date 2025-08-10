import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from 'src/user/dto/user.dto';

export const CurrentUser = createParamDecorator<string>(
  (_, ctx: ExecutionContext): User => {
    const request = ctx.switchToHttp().getRequest(); // eslint-disable-line
    const user: { sub: number; name: string } = request.user; // eslint-disable-line
    return { id: user.sub, name: user.name };
  },
);
