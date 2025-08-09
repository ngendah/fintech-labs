import { Module } from '@nestjs/common';
import { JengaController } from 'src/partners/jenga/jenga.controller';
import { SettingsModule } from 'src/settings/settings.module';
import { JengaApi } from 'src/partners/jenga/jenga.api';
import { JengaService } from 'src/partners/jenga/jenga.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [PrismaModule, SettingsModule, HttpModule],
  controllers: [JengaController],
  providers: [JengaService, JengaApi],
})
export class JengaModule {}
