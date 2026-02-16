import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';

@Injectable()
export class DatabaseService {
  private pool: Pool;

  constructor(private configService: ConfigService) {
    this.pool = new Pool({
      host: this.configService.get<string>('POSTGRES_HOST'),
      port: this.configService.get<number>('POSTGRES_PORT'),
      user: this.configService.get<string>('POSTGRES_USER'),
      password: this.configService.get<string>('POSTGRES_PASSWORD'),
      database: this.configService.get<string>('POSTGRES_DB'),
    });
  }

  query(sql: string, params?: any[]) {
    return this.pool.query(sql, params);
  }
}
