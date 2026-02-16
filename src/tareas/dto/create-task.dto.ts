import { IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  nombre!: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsNumber()
  @IsOptional()
  story_points?: number;

  @IsString()
  @IsOptional()
  fecha_entrega?: string;

  @IsNumber()
  @IsNotEmpty()
  asignado_id!: number;
}
