import { Module } from '@nestjs/common';
import { CoreModule } from './core/core.module';
import { ApiController } from './api.controller';

@Module({
  imports: [CoreModule],
  controllers: [ApiController],
})
export class ApiModule {}
