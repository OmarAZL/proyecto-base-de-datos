import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'El formato del email es inválido' })
  @IsNotEmpty({ message: 'El email no puede estar vacía' })
  email: string;

  @IsNotEmpty({ message: 'La contraseña no puede estar vacía' })
  password: string;
}