import { Module } from '@nestjs/common';
import { RegisterController } from './register.controller';
import { RegisterService } from './register.service';
import {
  AuthnzRepository,
  MongoModule,
  RegistrationRepository,
} from 'libs/shared';

@Module({
  imports: [MongoModule],
  controllers: [RegisterController],
  providers: [RegistrationRepository, AuthnzRepository, RegisterService],
})
export class RegisterModule {}
