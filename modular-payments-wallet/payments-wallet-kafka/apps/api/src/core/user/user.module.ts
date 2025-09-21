import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { KycModule } from '../../services/kyc/kyc.module';

@Module({
  imports: [KycModule],
  controllers: [UserController],
})
export class UserModule {}
