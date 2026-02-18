import { Injectable, BadRequestException, ConflictException, NotFoundException, HttpException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateTareaDto } from './dto/createTarea.dto';
import { UpdateTareaDto } from './dto/updateTarea.dto';
import { error } from 'node:console';

@Injectable()
export class TareasService {

  constructor(private db: DatabaseService) {}

  // ============================
  // CREAR TAREA
  // ============================
  async createTarea(data: CreateTareaDto, creadorId: number) {
    const { nombre, descripcion, story_points, fecha_entrega, asignado_id } = data;

    const sql = `
      INSERT INTO tareas (nombre, descripcion, story_points, fecha_entrega, creador_id, asignado_id)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;

    try {
    const result = await this.db.query(sql, 
    [nombre, descripcion, story_points, fecha_entrega, creadorId, asignado_id,]);
      
    return result.rows[0];
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException(`Ya existe una tarea con el nombre: "${nombre}"`);
      }
    }
    
    throw error;
  }

  // ============================
  // Actualizar TAREA
  // ============================
  async updateTarea(id: number, data: UpdateTareaDto) {
    const validKeys: (keyof UpdateTareaDto)[] = ["nombre", "descripcion", "story_points", "fecha_entrega", "asignado_id"];
    const keys = []
    const values = []

    Object.keys(data).forEach((key, i) => {
      if(validKeys.includes(key as keyof UpdateTareaDto)) {
        keys.push(`${key} = $${i + 1}`) // key = $i
        values.push(data[key])}
      });

     if (keys.length === 0) {
      throw new BadRequestException('No hay campos validos para actualizar');
    }
    
    const sql = `UPDATE tareas set ${keys.join(', ')} WHERE id = $${values.length + 1} RETURNING *;`;

    try {
      values.push(id)
      const result = await this.db.query(sql, values);
      if (result.rowCount === 0) {
        throw new NotFoundException(`No se encontró la tarea con el ID ${id}`);
      }
      return result.rows[0];
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      
      if (error.code === '23505') {
        throw new ConflictException(`Ya existe una tarea con el nombre: "${data.nombre}"`);
      }
    }
    
    throw error;
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
  // DETALLES DE UNA TAREA
  // ============================
  async detalles(id: number) {
    const tarea = await this.db.query('SELECT * FROM tareas WHERE id = $1', [id]);

    if (tarea.rowCount === 0) {
      throw new BadRequestException('La tarea no existe');
    }

    const comentarios = await this.db.query(
      'SELECT * FROM comentarios WHERE tarea_id = $1 ORDER BY fecha_creacion DESC',
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
    const sql = `INSERT INTO tareas_categorias (tarea_id, categoria_id) VALUES ($1, $2);`;

    try {
      await this.db.query(sql, [tareaId, categoriaId]);
      return { mensaje: 'Categoría asociada correctamente' };
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException(`Ya existe la relacion: (Tarea: ${tareaId}, Categoria: ${categoriaId})`);
      }
    }
    throw error;
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

  // ============================
  // CATEGORÍAS ASOCIADAS
  // ============================
  async categoriasAsociadas(tareaId: number) {
    const sql = `
      SELECT *
      FROM categorias
      WHERE id IN (
        SELECT categoria_id
        FROM tareas_categorias
        WHERE tarea_id = $1
      );
    `;

    const result = await this.db.query(sql, [tareaId]);
    return result.rows;
  }
}
