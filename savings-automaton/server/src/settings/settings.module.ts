import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';
import { ApiSettings, JengaSettings } from './settings';

const loadConfiguration = (): Record<string, any> => {
  const YAML_CONFIG_FILENAME = 'config.yaml';
  const file = readFileSync(
    join(__dirname, '../../', YAML_CONFIG_FILENAME),
    'utf8',
  );
  return yaml.load(file) as Record<string, any>;
};

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [loadConfiguration],
    }),
  ],
  providers: [JengaSettings, ApiSettings],
  exports: [JengaSettings, ApiSettings],
})
export class SettingsModule {}
