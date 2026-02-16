import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { CategoriasService } from './categorias.service';

@Controller('categorias')
export class CategoriasController {
  constructor(private readonly categoriasService: CategoriasService) {}

  @Post()
  crear(@Body() body: any) {
    return this.categoriasService.crear(body);
  }

  @Get()
  listar() {
    return this.categoriasService.listar();
  }

  @Get(':id')
  obtener(@Param('id') id: number) {
    return this.categoriasService.obtener(id);
  }
}
