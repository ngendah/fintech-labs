import { Module } from '@nestjs/common';
import { AuthnzController } from './authnz.controller';
import { AuthnzService } from './authnz.service';

@Module({
  imports: [],
  controllers: [AuthnzController],
  providers: [AuthnzService],
})
export class AuthnzModule {}
