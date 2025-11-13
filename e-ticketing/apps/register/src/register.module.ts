import { Module } from '@nestjs/common';
import { RegisterController } from './register.controller';
import { RegisterService } from './register.service';
import {
  AuthnzRepository,
  HealthCheckModule,
  JsonWebTokenModule,
  MongoModule,
  RegistrationRepository,
  UserSchemaModule,
} from 'libs/shared';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongoModule,
    HealthCheckModule,
    UserSchemaModule,
    JsonWebTokenModule,
  ],
  controllers: [RegisterController],
  providers: [RegistrationRepository, AuthnzRepository, RegisterService],
})
export class RegisterModule {}
