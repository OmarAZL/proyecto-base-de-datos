import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty()
  @IsEmail({}, { message: 'El formato del email es inválido' })
  @IsNotEmpty({ message: 'El email no puede estar vacía' })
  email: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'La contraseña no puede estar vacía' })
  password: string;
}