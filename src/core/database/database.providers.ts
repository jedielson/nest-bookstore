/* istanbul ignore file */

import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';
import { LoggerOptions } from 'typeorm';

export default class TypeOrmConfig {
  static createTypeOrmOptions(
    configService: ConfigService,
  ): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: configService.get<string>('TYPEORM_HOST'),
      port: +configService.get<number>('TYPEORM_PORT'),
      username: configService.get<string>('TYPEORM_USERNAME'),
      password: configService.get<string>('TYPEORM_PASSWORD'),
      database: configService.get<string>('TYPEORM_DATABASE'),
      synchronize: false,
      entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
      logging: configService.get<LoggerOptions>('TYPEORM_LOGGING'),
    };
  }
}
export const typeOrmConfigAsync: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  useFactory: async (
    configService: ConfigService,
  ): Promise<TypeOrmModuleOptions> =>
    TypeOrmConfig.createTypeOrmOptions(configService),
  inject: [ConfigService],
};
