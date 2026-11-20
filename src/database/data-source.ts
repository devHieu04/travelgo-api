import 'dotenv/config';
import { DataSource } from 'typeorm';
import { buildDatabaseOptions } from './database.config.js';

/** Dùng cho TypeORM CLI: yarn migration:generate / migration:run / migration:revert. */
export default new DataSource(buildDatabaseOptions(process.env));
