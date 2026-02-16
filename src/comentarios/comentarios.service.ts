import { Injectable } from '@nestjs/common';

@Injectable()
export class ComentariosService {
  private comentarios = [];

  crear(data: any) {
    const nuevo = { id: Date.now(), ...data };
    this.comentarios.push(nuevo);
    return nuevo;
  }

  listar() {
    return this.comentarios;
  }

  obtener(id: number) {
    return this.comentarios.find((c) => c.id === id);
  }
}
