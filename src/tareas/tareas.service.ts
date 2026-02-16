import { Injectable, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateTarea } from './dto/createTarea.dto';

@Injectable()
export class TareasService {

  constructor(private db: DatabaseService) {}

  async getTareas() {
    const result = await this.db.query('SELECT * FROM tareas');
    return result.rows;
  }

  async getTarea(id: number) {
    const result = await this.db.query('SELECT * FROM tareas WHERE id = $1', [id]);
    return result.rows[0];
  }

  // ============================
  // CREAR TAREA
  // ============================
  async createTarea(data: CreateTarea, creadorId: number) {
    const { nombre, descripcion, story_points, fecha_entrega, asignado_id } = data;

    if (!asignado_id) {
      throw new BadRequestException('El campo asignado_id es obligatorio');
    }

    const sql = `
      INSERT INTO tareas (nombre, descripcion, story_points, fecha_entrega, creador_id, asignado_id)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;

    const result = await this.db.query(sql, 
      [nombre, descripcion, story_points, fecha_entrega, creadorId, asignado_id,]
    );

    return result.rows[0];
  }

  // ============================
  // LISTAR TAREAS (con filtros)
  // ============================
  async listar(filtros: any) {
    let sql = 'SELECT * FROM tareas WHERE 1=1';
    const params: any[] = [];

    if (filtros.usuario) {
      params.push(filtros.usuario);
      sql += ` AND asignado_id = $${params.length}`;
    }

    if (filtros.estado) {
      params.push(filtros.estado);
      sql += ` AND estado = $${params.length}`;
    }

    const result = await this.db.query(sql, params);
    return result.rows;
  }

  // ============================
  // ACTUALIZAR TAREA
  // ============================
  async actualizar(id: number, data: any) {
    const campos = [];
    const valores = [];

    Object.keys(data).forEach((key, i) => {
      campos.push(`${key} = $${i + 1}`);
      valores.push(data[key]);
    });

    if (campos.length === 0) {
      throw new BadRequestException('No hay campos para actualizar');
    }

    const sql = `
      UPDATE tareas
      SET ${campos.join(', ')}
      WHERE id = $${valores.length + 1}
      RETURNING *;
    `;

    valores.push(id);

    const result = await this.db.query(sql, valores);
    return result.rows[0];
  }

  // ============================
  // DETALLES DE UNA TAREA
  // ============================
  async detalles(id: number) {
    const tarea = await this.db.query('SELECT * FROM tareas WHERE id = $1', [id]);

    if (tarea.rowCount === 0) {
      throw new BadRequestException('La tarea no existe');
    }

    const comentarios = await this.db.query(
      'SELECT * FROM comentarios WHERE tarea_id = $1 ORDER BY fecha DESC',
      [id],
    );

    const categorias = await this.db.query(
      `
      SELECT c.*
      FROM categorias c
      JOIN tareas_categorias tc ON tc.categoria_id = c.id
      WHERE tc.tarea_id = $1
      `,
      [id],
    );

    return {
      ...tarea.rows[0],
      comentarios: comentarios.rows,
      categorias: categorias.rows,
    };
  }

  // ============================
  // ASOCIAR CATEGORÍA A TAREA
  // ============================
  async asociarCategoria(tareaId: number, categoriaId: number) {
    const sql = `
      INSERT INTO tareas_categorias (tarea_id, categoria_id)
      VALUES ($1, $2)
      ON CONFLICT DO NOTHING;
    `;

    await this.db.query(sql, [tareaId, categoriaId]);

    return { mensaje: 'Categoría asociada correctamente' };
  }

  // ============================
  // CATEGORÍAS NO ASOCIADAS
  // ============================
  async categoriasNoAsociadas(tareaId: number) {
    const sql = `
      SELECT *
      FROM categorias
      WHERE id NOT IN (
        SELECT categoria_id
        FROM tareas_categorias
        WHERE tarea_id = $1
      );
    `;

    const result = await this.db.query(sql, [tareaId]);
    return result.rows;
  }
}
