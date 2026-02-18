import { Body, Controller, Get, Param, ParseIntPipe, Post, Req, UseGuards } from '@nestjs/common';
import { ComentariosService } from './comentarios.service';
import { JwtGuard } from '../auth/jwt.guard';
import { CreateComentarioDto } from './dto/createComentario.dto';
import { ApiBearerAuth, ApiExcludeEndpoint, ApiOkResponse, ApiOperation, ApiParam } from '@nestjs/swagger';

@ApiBearerAuth('token-auth')
@Controller('/tareas/:tareaID/comentarios')
@UseGuards(JwtGuard)
export class ComentariosController {
  constructor(private readonly comentariosService: ComentariosService) {}

  @ApiExcludeEndpoint()
  @Get()
  async getComentarios(@Param('tareaID') tareaID: number ) {
    return this.comentariosService.getComentarios(tareaID);
  }

  @ApiExcludeEndpoint()
  @Get(':id')
  async getComentario(
    @Param('tareaID') tareaID: number,
    @Param('id') id: number) {
    return this.comentariosService.getComentario(tareaID, id);
  }

  
  @ApiOkResponse({ 
    description: 'Crea un comentario (asociado a una tarea)'
  })
  @ApiOperation({ 
    summary: 'Crear un comentario'
  })
  @ApiParam({
    name: 'tareaID',
    description: 'El identificador único de la tarea',
    example: '1',
    type: Number
  }) 
  @Post()
  async createComentario(
    @Body() body: CreateComentarioDto,
    @Param('tareaID', ParseIntPipe) tareaID: number,  
    @Req() req: any) {
      const creadorID = req.user.id;
      return this.comentariosService.createComentario(body, tareaID, creadorID);   
  }
  
}
