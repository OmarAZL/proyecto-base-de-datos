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
import { CreateTareaDto, TareaEstado } from './dto/createTarea.dto';
import { UpdateTareaDto } from './dto/updateTarea.dto';
import { ApiBearerAuth, ApiExcludeEndpoint, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth('token-auth')
@Controller('tareas')
@UseGuards(JwtGuard)
export class TareasController {
  constructor(private tareas: TareasService) {}

  @ApiOkResponse({ 
    description: 'Se crea la tarea'
  })
  @ApiOperation({ 
    summary: 'Crea una nueva tarea'
  })
  @Post()
  createTarea(@Body() body: CreateTareaDto, @Req() req: any) {
    return this.tareas.createTarea(body, req.user.id);
  }

  @ApiOkResponse({ 
    description: 'Se actualiza la tarea'
  })
  @ApiOperation({ 
    summary: 'Actualiza una tarea'
  })
  @ApiParam({
    name: 'id',
    description: 'El identificador único de la tarea',
    example: '1',
    type: Number
  })
  @Patch('/:id')
  updateTarea(@Body() body: UpdateTareaDto, @Param('id') id: number) {
    return this.tareas.updateTarea(id, body);
  }

  @ApiOkResponse({ 
    description: 'Lista las tareas'
  })
  @ApiOperation({ 
    summary: 'Listar todas las tarea'
  })
  @ApiQuery({ 
    name: 'estado', 
    required: false,
    enum: TareaEstado, 
    type: String
  })
  @ApiQuery({ 
    name: 'usuario', 
    description: 'El id del usuario a quien esta asignada la tarea',
    required: false, 
    type: Number
  })
  @Get()
  listar(@Query() query: any) {
    console.log(query);
    return this.tareas.listar(query);
  }

  @ApiOkResponse({ 
    description: 'Muestra la tarea junto con los comentarios y las categorias asociadas'
  })
  @ApiOperation({ 
    summary: 'Mostrar una tarea'
  })
  @ApiParam({
    name: 'id',
    description: 'El identificador único de la tarea',
    example: '1',
    type: Number
  })
  @Get(':id')
  detalles(@Param('id', ParseIntPipe) id: number) {
    return this.tareas.detalles(id);
  }

  @ApiExcludeEndpoint()
  @Get(':id/categorias')
  categoriasAsociadas(@Param('id', ParseIntPipe) id: number) {
    return this.tareas.categoriasAsociadas(id);
  }

  @ApiOkResponse({ 
    description: 'Asocia la categoria con la tarea'
  })
  @ApiOperation({ 
    summary: 'Asociar una categoria con una tarea'
  })
  @ApiParam({
    name: 'id',
    description: 'El identificador único de la tarea',
    example: '1',
    type: Number
  })
  @ApiParam({
    name: 'catId',
    description: 'El identificador único de la categoría',
    example: '1',
    type: Number
  })
  @Post(':id/categorias/:catId')
  asociar(@Param('id', ParseIntPipe) id: number, @Param('catId', ParseIntPipe) catId: number) {
    return this.tareas.asociarCategoria(id, catId);
  }

  
  @ApiOkResponse({ 
    description: 'Lista las categorias no asociadas a la tarea'
  })
  @ApiOperation({ 
    summary: 'Listar todas las categorias que no esten asociadas a una tarea'
  })
  @ApiParam({
    name: 'id',
    description: 'El identificador único de la tarea',
    example: '1',
    type: Number
  })  
  @Get(':id/categorias/no-asociadas')
  noAsociadas(@Param('id', ParseIntPipe) id: number) {
    return this.tareas.categoriasNoAsociadas(id);
  }
}
