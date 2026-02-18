import {
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
  Req,
  ParseIntPipe,
} from '@nestjs/common';

import { TareasService } from './tareas.service';
import { JwtGuard } from '../auth/jwt.guard';
import { CreateTareaDto } from './dto/createTarea.dto';
import { UpdateTareaDto } from './dto/updateTarea.dto';

@Controller('tareas')
@UseGuards(JwtGuard)
export class TareasController {
  constructor(private tareas: TareasService) {}

  @Post()
  createTarea(@Body() body: CreateTareaDto, @Req() req: any) {
    return this.tareas.createTarea(body, req.user.id);
  }

  @Patch('/:id')
  updateTarea(@Body() body: UpdateTareaDto, @Param('id') id: number) {
    return this.tareas.updateTarea(id, body);
  }

  @Get()
  listar(@Query() query: any) {
    console.log(query);
    return this.tareas.listar(query);
  }

  @Get(':id')
  detalles(@Param('id', ParseIntPipe) id: number) {
    return this.tareas.detalles(id);
  }

  @Get(':id/categorias')
  categoriasAsociadas(@Param('id', ParseIntPipe) id: number) {
    return this.tareas.categoriasAsociadas(id);
  }

  @Post(':id/categorias/:catId')
  asociar(@Param('id', ParseIntPipe) id: number, @Param('catId', ParseIntPipe) catId: number) {
    return this.tareas.asociarCategoria(id, catId);
  }

  @Get(':id/categorias/no-asociadas')
  noAsociadas(@Param('id', ParseIntPipe) id: number) {
    return this.tareas.categoriasNoAsociadas(id);
  }
}
