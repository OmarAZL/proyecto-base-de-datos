export interface CreateTarea {
    nombre: string;
  	descripcion?: string;
  	story_points?: number;
  	fecha_entrega?: string;
  	creador_id: number;
  	asignado_id: number;
}