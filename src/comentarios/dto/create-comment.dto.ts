import { IsString, IsNotEmpty } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  contenido: string;

  @IsString()
  @IsNotEmpty()
  autor: string;
}
