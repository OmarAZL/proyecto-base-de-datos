import { IsString, IsOptional, IsInt, IsNotEmpty, IsISO8601 } from 'class-validator';

export class CreateTareaDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsInt()
  @IsOptional()
  story_points?: number;

  @IsISO8601() // Valida formato de fecha YYYY-MM-DD
  @IsOptional()
  fecha_entrega?: string;

  @IsInt()
  @IsNotEmpty()
  asignado_id: number;
}