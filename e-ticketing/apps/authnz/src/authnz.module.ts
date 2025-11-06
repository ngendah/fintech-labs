import { Module } from '@nestjs/common';
import { AuthnzController } from './authnz.controller';
import { AuthnzService } from './authnz.service';
import {
  AuthnzRepository,
  JsonWebTokenModule,
  MongoModule,
  UserSchemaModule,
} from 'libs/shared';

@Module({
  imports: [MongoModule, UserSchemaModule, JsonWebTokenModule],
  controllers: [AuthnzController],
  providers: [AuthnzRepository, AuthnzService],
})
export class AuthnzModule {}
