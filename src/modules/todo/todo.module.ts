import { Module } from '@nestjs/common';
import { TodoService } from '@modules/todo/services/todo/todo.service';
import { TodoController } from '@modules/todo/controllers/todo/todo.controller';
import { Todo } from './models/todo.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Todo])],
  providers: [TodoService],
  controllers: [TodoController]
})
export class TodoModule {}
