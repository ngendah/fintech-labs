import { Controller, Get } from '@nestjs/common';

@Controller()
export class ApiController {
  @Get()
  pong() {
    return 'pong';
  }
}
