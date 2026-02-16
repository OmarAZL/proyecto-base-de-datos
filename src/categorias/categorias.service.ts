import { Injectable } from '@nestjs/common';

@Injectable()
export class CategoriasService {
  private categorias = [];

  crear(data: any) {
    const nueva = { id: Date.now(), ...data };
    this.categorias.push(nueva);
    return nueva;
  }

  listar() {
    return this.categorias;
  }

  obtener(id: number) {
    return this.categorias.find((c) => c.id === id);
  }
}
