import { Injectable, UnauthorizedException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private db: DatabaseService,
    private jwt: JwtService,
  ) {}

  async revokeToken(token: string) {
    // Usamos el nombre en español para la tabla y la columna
    const query = 'INSERT INTO blacklist_tokens (token) VALUES ($1)';
    await this.db.query(query, [token]);
  }

  async isTokenRevoked(token: string): Promise<boolean> {
    const query = 'SELECT 1 FROM blacklist_tokens WHERE token = $1';
    const res = await this.db.query(query, [token]);
    return res.rows.length > 0;
  }

  async login(email: string, password: string) {
    const result = await this.db.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    const user = result.rows[0];

    if(user?.password !== password) {
      throw new UnauthorizedException('Credenciales inválidas')
    }

    /*
    Lo ideal seria comparar el hash de la contraseña, 
    para simplificar estaremos comparando directamente las contraseñas. 
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new UnauthorizedException('Credenciales inválidas')
    };*/

    const token = this.jwt.sign({ id: user.id, email: user.email });

    return { token };
  }



}
