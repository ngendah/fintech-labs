import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { FRAUD_DETECTION_SERVICE } from 'lib/common';
import { FraudService } from './fraud.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: FRAUD_DETECTION_SERVICE,
        transport: Transport.TCP,
        options: {
          port: 3001, // TODO: use configuration
        },
      },
    ]),
  ],
  providers: [FraudService],
  exports: [FraudService],
})
export class FraudModule {}
