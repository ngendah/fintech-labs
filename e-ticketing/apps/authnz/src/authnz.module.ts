import { Module } from '@nestjs/common';
import { AuthnzController } from './authnz.controller';
import { AuthnzService } from './authnz.service';
import {
  AuthnzRepository,
  JsonWebTokenModule,
  MongoModule,
  UserSchemaModule,
} from 'libs/shared';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongoModule,
    UserSchemaModule,
    JsonWebTokenModule,
  ],
  controllers: [AuthnzController],
  providers: [AuthnzRepository, AuthnzService],
})
export class AuthnzModule {}
