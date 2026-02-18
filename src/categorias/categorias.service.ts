import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateCategoriaDto } from './dto/createCategoria.dto';

@Injectable()
export class CategoriasService {
  constructor(private db: DatabaseService) {}
  
  async createCategoria(nuevaCategoria: CreateCategoriaDto) {
    const sql = `INSERT INTO categorias(nombre, descripcion, color) VALUES ($1, $2, $3) RETURNING *`
    const result = await this.db.query(sql, [...Object.values(nuevaCategoria)])
    
    return result.rows[0];
  }

  async deleteCategoria(categoriaID: number) {
    const sql = `DELETE FROM categorias WHERE id = $1 RETURNING *`
    const result = await this.db.query(sql, [categoriaID])
    if (result.rowCount === 0) {
      throw new NotFoundException(`No se encontró la categoria con el ID ${categoriaID}`);
    }
    
    return result.rows[0];
  }

  async getCategorias() {
    const sql = `SELECT * FROM categorias`
    const result = await this.db.query(sql)
    
    return result.rows;
  }

  async getCategoria(id: number) {
    const sql = `SELECT * FROM categorias WHERE id = $1`
    const result = await this.db.query(sql, [id])
    
    return result.rows[0];
  }
}
