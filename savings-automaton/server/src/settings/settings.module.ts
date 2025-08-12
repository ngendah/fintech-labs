import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { existsSync, readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';
import { ApiSettings, JengaSettings } from './settings';

function findFirst(paths: string[], filename: string): string | undefined {
  for (const path of paths) {
    const filePath = join(path, filename);
    if (existsSync(filePath)) {
      return filePath;
    }
  }
}

function loadConfiguration(): Record<string, any> {
  const configurationPaths: string[] = [
    join(__dirname, '../../'),
    '/etc',
    '/tmp',
    '/run/secrets',
  ];
  const YAML_CONFIG_FILENAME = 'config.yaml';
  const filePath = findFirst(configurationPaths, YAML_CONFIG_FILENAME);
  if (!filePath) {
    const filePaths = configurationPaths.reduce((p, s) => `${p}\n${s}`);
    throw new Error(
      `Configuration file ${YAML_CONFIG_FILENAME}, does not exists on the following paths:\n${filePaths}`,
    );
  }
  const file = readFileSync(filePath, 'utf8');
  return yaml.load(file) as Record<string, any>;
}

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
