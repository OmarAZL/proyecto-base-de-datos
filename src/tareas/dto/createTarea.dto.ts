import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsInt, IsNotEmpty, IsISO8601 } from 'class-validator';

export enum TareaEstado {
  PENDIENTE = 'pendiente',
  EN_PROGRESO = 'en progreso',
  EN_REVISION = 'en revisión',
  COMPLETADO = 'completado'
}

export class CreateTareaDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  descripcion?: string;

  @ApiPropertyOptional()
  @IsInt()
  @IsOptional()
  story_points?: number;

  @ApiPropertyOptional()
  @IsISO8601() // Valida formato de fecha YYYY-MM-DD
  @IsOptional()
  fecha_entrega?: string;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  asignado_id: number;
}