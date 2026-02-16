import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ComentariosService } from './comentarios.service';

@Controller('comentarios')
export class ComentariosController {
  constructor(private readonly comentariosService: ComentariosService) {}

  @Post()
  crear(@Body() body: any) {
    return this.comentariosService.crear(body);
  }

  @Get()
  listar() {
    return this.comentariosService.listar();
  }

  @Get(':id')
  obtener(@Param('id') id: number) {
    return this.comentariosService.obtener(id);
  }
}
