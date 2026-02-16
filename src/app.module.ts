import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TareasModule } from './tareas/tareas.module';
import { CategoriasModule } from './categorias/categorias.module';
import { ComentariosModule } from './comentarios/comentarios.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    TareasModule,
    CategoriasModule,
    ComentariosModule,
  ],
})
export class AppModule {}
