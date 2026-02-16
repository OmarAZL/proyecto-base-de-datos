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

@Controller('tareas')
@UseGuards(JwtGuard)
export class TareasController {
  constructor(private tareas: TareasService) {}

  @Post()
  crear(@Body() body: CreateTarea, @Req() req: any) {
    return this.tareas.createTarea(body, req.user.id);
  }

  @Get()
  listar(@Query() query: any) {
    console.log(query);
    return this.tareas.getTareas();
  }

  @Patch(':id')
  actualizar(@Param('id') id: number, @Body() body: any) {
    delete body.creador_id;
    delete body.id;
    return this.tareas.actualizar(id, body);
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
