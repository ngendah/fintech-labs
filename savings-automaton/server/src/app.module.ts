import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from 'src/app.service';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
