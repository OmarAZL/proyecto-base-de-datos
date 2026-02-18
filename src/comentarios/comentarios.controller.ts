import { Body, Controller, Get, Param, ParseIntPipe, Post, Req, UseGuards } from '@nestjs/common';
import { ComentariosService } from './comentarios.service';
import { JwtGuard } from '../auth/jwt.guard';
import { CreateComentarioDto } from './dto/createComentario.dto';

@Controller('/tareas/:tareaID/comentarios')
@UseGuards(JwtGuard)
export class ComentariosController {
  constructor(private readonly comentariosService: ComentariosService) {}

  @Get()
  async getComentarios(@Param('tareaID') tareaID: number ) {
    return this.comentariosService.getComentarios(tareaID);
  }

  @Get(':id')
  async getComentario(
    @Param('tareaID') tareaID: number,
    @Param('id') id: number) {
    return this.comentariosService.getComentario(tareaID, id);
  }

  @Post()
  async createComentario(
    @Body() body: CreateComentarioDto,
    @Param('tareaID', ParseIntPipe) tareaID: number,  
    @Req() req: any) {
      const creadorID = req.user.id;
      const { content } = body
      return this.comentariosService.createComentario(content, tareaID, creadorID);   
  }
  
}
