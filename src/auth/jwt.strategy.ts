import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService, private auth: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('JWT_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(req: any, payload: any) {
    // 1. Extraer el token del request
    const token = req.headers.authorization.split(' ')[1];

    // 2. Verificar si está en la lista negra
    const isRevoked = await this.auth.isTokenRevoked(token);
    
    if (isRevoked) {
      throw new UnauthorizedException('Este token ya no es válido (Sesión cerrada)');
    }
    // 3. Si no está revocado, procedemos normal
    return { id: payload.id, email: payload.email };
  }
}
