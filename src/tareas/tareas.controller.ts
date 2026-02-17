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
} from '@nestjs/common';

import { TareasService } from './tareas.service';
import { JwtGuard } from '../auth/jwt.guard';
import { CreateTarea } from './dto/createTarea.dto';
import { UpdateTarea } from './dto/updateTarea.dto';

@Controller('tareas')
@UseGuards(JwtGuard)
export class TareasController {
  constructor(private tareas: TareasService) {}

  @Post()
  createTarea(@Body() body: CreateTarea, @Req() req: any) {
    return this.tareas.createTarea(body, req.user.id);
  }

  @Patch('/:id')
  updateTarea(@Body() body: UpdateTarea, @Param('id') id: number) {
    return this.tareas.updateTarea(id, body);
  }

  @Get()
  listar(@Query() query: any) {
    console.log(query);
    return this.tareas.listar(query);
  }

  @Get(':id')
  detalles(@Param('id') id: number) {
    return this.tareas.detalles(id);
  }

  @Post(':id/categorias/:catId')
  asociar(@Param('id') id: number, @Param('catId') catId: number) {
    return this.tareas.asociarCategoria(id, catId);
  }

  @Get(':id/categorias/no-asociadas')
  noAsociadas(@Param('id') id: number) {
    return this.tareas.categoriasNoAsociadas(id);
  }
}
