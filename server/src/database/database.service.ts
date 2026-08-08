import { Injectable } from '@nestjs/common';
import { drizzle, PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

@Injectable()
export class DatabaseService {
  private db: PostgresJsDatabase<typeof schema>;
  private client: postgres.Sql;

  constructor() {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      throw new Error('DATABASE_URL environment variable is required');
    }

    this.client = postgres(databaseUrl);
    this.db = drizzle(this.client, { schema });
  }

  getDb(): PostgresJsDatabase<typeof schema> {
    return this.db;
  }

  async onModuleDestroy() {
    await this.client.end();
  }
}
