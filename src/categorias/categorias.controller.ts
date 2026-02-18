import { Controller, Get, Post, Body, Param, Delete, UseGuards, ParseIntPipe } from '@nestjs/common';
import { CategoriasService } from './categorias.service';
import { CreateCategoriaDto } from './dto/createCategoria.dto';
import { JwtGuard } from '../auth/jwt.guard';
import { ApiBearerAuth, ApiExcludeEndpoint, ApiOkResponse, ApiOperation, ApiParam } from '@nestjs/swagger';

@ApiBearerAuth('token-auth')
@Controller('categorias')
@UseGuards(JwtGuard)
export class CategoriasController {
  constructor(private readonly categoriasService: CategoriasService) {}
  
  @ApiExcludeEndpoint()
  @Post()
  createCategoria(@Body() body: CreateCategoriaDto) {
    return this.categoriasService.createCategoria(body);
  }

  
  @ApiOkResponse({ 
    description: 'Elimina la categoria'
  })
  @ApiOperation({ 
    summary: 'Eliminar una categoria, incluso en las tareas asociadas (sin eliminar la tarea)'
  })
  @ApiParam({
    name: 'id',
    description: 'El identificador único de la categoria',
    example: '1',
    type: Number
  })  
  @Delete(':id')
  deleteCategoria(@Param('id', ParseIntPipe) id: number) {
    return this.categoriasService.deleteCategoria(id);
  }

  @ApiExcludeEndpoint()
  @Get()
  getCategorias() {
    return this.categoriasService.getCategorias();
  }

  @ApiExcludeEndpoint()
  @Get(':id')
  getCategoria(@Param('id', ParseIntPipe) id: number) {
    return this.categoriasService.getCategoria(id);
  }
}
