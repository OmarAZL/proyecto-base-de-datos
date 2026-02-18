import { Controller, Get, Post, Body, Param, Delete, UseGuards, ParseIntPipe } from '@nestjs/common';
import { CategoriasService } from './categorias.service';
import { CreateCategoria } from './dto/createCategoria.dto';
import { JwtGuard } from '../auth/jwt.guard';

@Controller('categorias')
@UseGuards(JwtGuard)
export class CategoriasController {
  constructor(private readonly categoriasService: CategoriasService) {}

  @Post()
  createCategoria(@Body() body: CreateCategoria) {
    return this.categoriasService.createCategoria(body);
  }

  @Delete(':id')
  deleteCategoria(@Param('id', ParseIntPipe) id: number) {
    return this.categoriasService.deleteCategoria(id);
  }

  @Get()
  getCategorias() {
    return this.categoriasService.getCategorias();
  }

  @Get(':id')
  getCategoria(@Param('id', ParseIntPipe) id: number) {
    return this.categoriasService.getCategoria(id);
  }
}
