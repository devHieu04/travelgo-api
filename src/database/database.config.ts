import { join } from 'node:path';
import type { DataSourceOptions } from 'typeorm';
import { ENTITIES } from './entities.js';
import { SnakeNamingStrategy } from './snake-naming.strategy.js';

type Env = Record<string, string | undefined>;

/**
 * Cấu hình Postgres dùng chung cho Nest (AppModule) và TypeORM CLI
 * (data-source.ts). Schema chỉ thay đổi qua migration, không bật `synchronize`.
 */
export function buildDatabaseOptions(env: Env): DataSourceOptions {
  return {
    type: 'postgres',
    host: env.DB_HOST ?? 'localhost',
    port: Number(env.DB_PORT ?? 5432),
    username: env.DB_USERNAME ?? 'travelgo',
    password: env.DB_PASSWORD ?? 'travelgo',
    database: env.DB_DATABASE ?? 'travelgo',
    entities: ENTITIES,
    // App và CLI đều chạy từ dist/. Chỉ lấy .js vì dist còn có file .d.ts.
    migrations: [join(import.meta.dirname, 'migrations', '*.js')],
    migrationsTableName: 'typeorm_migrations',
    namingStrategy: new SnakeNamingStrategy(),
    // gen_random_uuid() có sẵn từ Postgres 13, không cần uuid-ossp.
    uuidExtension: 'pgcrypto',
    synchronize: false,
    migrationsRun: false,
    logging: env.DB_LOGGING === 'true',
  };
}
