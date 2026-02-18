import { IsString, IsOptional, IsInt, IsISO8601 } from 'class-validator';

export class UpdateTareaDto {
	@IsOptional()
	@IsString() 
	nombre?: string;

	@IsOptional()
	@IsString()
	descripcion?: string;

	@IsOptional()
	@IsInt()
	story_points?: number;

	@IsOptional()
	@IsISO8601()
	fecha_entrega?: string;

	@IsOptional()
	@IsInt()
	asignado_id?: number;
}