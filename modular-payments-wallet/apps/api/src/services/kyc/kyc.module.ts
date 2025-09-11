import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { KYC_SERVICE } from 'lib/common';
import { KycService } from './kyc.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: KYC_SERVICE,
        transport: Transport.TCP,
        options: {
          port: 3002, // TODO: use configuration
        },
      },
    ]),
  ],
  providers: [KycService],
  exports: [KycService],
})
export class KycModule {}
