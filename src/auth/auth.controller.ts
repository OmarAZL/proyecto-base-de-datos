import { Controller, Post, Body, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtGuard } from './jwt.guard';
import { LoginDto } from './dto/login.dto';
import { ApiBearerAuth, ApiOkResponse, ApiOperation } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @ApiOkResponse({ 
    description: 'Login exitoso, devuelve el token JWT.',
  })
  @ApiOperation({ 
    summary: 'Iniciar sesión (Generar token).'
  })
  @Post('login')
  login(@Body() body: LoginDto) {
    return this.auth.login(body);
  }

  @ApiOkResponse({ 
    description: 'Sesión cerrada y token invalidado.'
  })
  @ApiOperation({ 
    summary: 'Cerrar sesión.'
  })
  @ApiBearerAuth('token-auth')
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
