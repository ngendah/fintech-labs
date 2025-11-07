import { Module } from '@nestjs/common';
import { createMicroserviceClientModule, APP_NAME } from 'libs/shared';

@Module({
  imports: [createMicroserviceClientModule(APP_NAME)],
})
export class BookingModule {}
