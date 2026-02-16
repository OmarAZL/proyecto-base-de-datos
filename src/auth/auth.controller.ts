import { Controller, Post, Body, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtGuard } from './jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post('login')
  login(@Body() body) {
    return this.auth.login(body.email, body.password);
  }

  @UseGuards(JwtGuard)
  @Post('logout')
  async logout(@Req() req: Request) {
    // Extraemos el token del header "Authorization: Bearer <token>"

    const authHeader = req.headers['authorization'];
  
    if (!authHeader) {
      throw new UnauthorizedException('No se proporcionó token');
    }

    const token = authHeader.split(' ')[1];

    await this.auth.revokeToken(token);
    return { message: 'Sesión cerrada y token invalidado' };
  }

}
