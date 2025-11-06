import { Module } from '@nestjs/common';
import { RegisterController } from './register.controller';
import { RegisterService } from './register.service';
import {
  AuthnzRepository,
  JsonWebTokenModule,
  MongoModule,
  RegistrationRepository,
  UserSchemaModule,
} from 'libs/shared';

@Module({
  imports: [MongoModule, UserSchemaModule, JsonWebTokenModule],
  controllers: [RegisterController],
  providers: [RegistrationRepository, AuthnzRepository, RegisterService],
})
export class RegisterModule {}
