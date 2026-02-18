import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsInt, IsISO8601 } from 'class-validator';

export class UpdateTareaDto {
	@ApiPropertyOptional()
	@IsOptional()
	@IsString() 
	nombre?: string;

	@ApiPropertyOptional()
	@IsOptional()
	@IsString()
	descripcion?: string;

	@ApiPropertyOptional()
	@IsOptional()
	@IsInt()
	story_points?: number;

	@ApiPropertyOptional()
	@IsOptional()
	@IsISO8601()
	fecha_entrega?: string;

	@ApiPropertyOptional()
	@IsOptional()
	@IsInt()
	asignado_id?: number;
}