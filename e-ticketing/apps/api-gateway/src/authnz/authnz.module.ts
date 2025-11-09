import { Module } from '@nestjs/common';
import { createMicroserviceClientModule, AUTHNZ_SERVICE } from 'libs/shared';
import { AuthnzService } from './authnz.service';
import { AuthnzController } from './authnz.controller';

@Module({
  imports: [createMicroserviceClientModule(AUTHNZ_SERVICE)],
  providers: [AuthnzService],
  controllers: [AuthnzController],
  exports: [AuthnzService],
})
export class AuthnzModule {}
