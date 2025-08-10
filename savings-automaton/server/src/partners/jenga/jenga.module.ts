import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { JengaApi } from 'src/partners/jenga/jenga.api';
import { JengaController } from 'src/partners/jenga/jenga.controller';
import { JengaService } from 'src/partners/jenga/jenga.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { SettingsModule } from 'src/settings/settings.module';

@Module({
  imports: [PrismaModule, SettingsModule, HttpModule],
  controllers: [JengaController],
  providers: [JengaService, JengaApi],
  exports: [JengaService],
})
export class JengaModule {}
