import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class UsersService {
  constructor(private db: DatabaseService) {}

  async findById(id: number) {
    const result = await this.db.query(
      'SELECT id, name, email FROM users WHERE id = $1',
      [id],
    );
    return result.rows[0];
  }
}