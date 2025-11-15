import { Module } from '@nestjs/common';
import { AuthnzController } from './authnz.controller';
import { AuthnzService } from './authnz.service';
import {
  HealthCheckModule,
  AuthnzRepository,
  JsonWebTokenModule,
  MongoModule,
  UserSchemaModule,
  UserCacheModule,
} from 'libs/shared';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongoModule,
    HealthCheckModule,
    UserCacheModule,
    UserSchemaModule,
    JsonWebTokenModule,
  ],
  controllers: [AuthnzController],
  providers: [AuthnzRepository, AuthnzService],
})
export class AuthnzModule {}
