import { Module } from '@nestjs/common';
import { TodoService } from '@modules/todo/services/todo/todo.service';
import { TodoController } from '@modules/todo/controllers/todo/todo.controller';
import { Todo } from './models/todo.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

/**
 * Módulo de tarefas
 * 
 * Módulo responsável por definir os controladores, serviços e entidades
 * referentes às tarefas dos usuários
 */
@Module({
  imports: [TypeOrmModule.forFeature([Todo])],
  providers: [TodoService],
  controllers: [TodoController]
})
export class TodoModule {}
