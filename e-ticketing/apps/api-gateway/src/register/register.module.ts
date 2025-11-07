import { Module } from '@nestjs/common';
import { createMicroserviceClientModule, REGISTER_SERVICE } from 'libs/shared';
import { RegisterController } from './register.controller';
import { RegisterService } from './register.service';

@Module({
  imports: [createMicroserviceClientModule(REGISTER_SERVICE)],
  controllers: [RegisterController],
  providers: [RegisterService],
})
export class RegisterModule {}
