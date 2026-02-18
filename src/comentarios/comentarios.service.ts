import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateComentarioDto } from './dto/createComentario.dto';

@Injectable()
export class ComentariosService {
  constructor(private db: DatabaseService) {}
  
  async getComentarios(tareaID: number) {
    const sql = `SELECT * FROM comentarios WHERE tarea_id = $1`
    const result = await this.db.query(sql, [tareaID]);
    return result.rows;
  }

  async getComentario(tareaID: number, comentarioID: number) {
    const sql = `SELECT * FROM comentarios WHERE tarea_id = $1 AND id = $2`
    const result = await this.db.query(sql, [tareaID, comentarioID]);
    return result.rows[0];
  }

  async createComentario(comentario: CreateComentarioDto, tareaID: number, creadorID: number) {
    const existsTarea = await this.db.query(`SELECT 1 FROM tareas WHERE id = $1`, [tareaID])
    if (existsTarea.rowCount === 0) {
      throw new NotFoundException(`No se encontró la tarea con el ID ${tareaID}`);
    }

    const sql = `INSERT INTO comentarios(contenido, tarea_id, creador_id) VALUES ($1, $2, $3) RETURNING *`
    const result = await this.db.query(sql, [comentario.contenido, tareaID, creadorID])
    return result.rows[0];
  }
}
 