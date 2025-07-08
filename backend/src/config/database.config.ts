import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { environmentConfig } from './environment.config';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: environmentConfig.database.host,
  port: environmentConfig.database.port,
  username: environmentConfig.database.username,
  password: environmentConfig.database.password,
  database: environmentConfig.database.database,
  autoLoadEntities: true,
  synchronize: true,
  retryAttempts: 20,
  retryDelay: 5000,
  verboseRetryLog: true,
}; 