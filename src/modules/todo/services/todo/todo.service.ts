import { Injectable } from '@nestjs/common';
import { Todo } from '@modules/todo/models/todo.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TodoDto, TodoEditDto } from '@modules/todo/validations/todo.dto';
import { User } from '@modules/user/models/user.entity';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo) private readonly todoRepository: Repository<Todo>,
  ) {}

  async get(id: string, user: User): Promise<Todo> {
    return await this.todoRepository.findOne({ where: { id, user: { id: user.id} }});
  }

  async getAll(user: User): Promise<Todo[]> {
    return await this.todoRepository.find({ where: { user: { id: user.id} } });
  }

  async create(todoDto: TodoDto, user: User): Promise<Todo> {
    return await this.todoRepository.save({ ...todoDto, user: user });
  }

  async update(todoEditDto: TodoEditDto, user: User): Promise<Todo> {
    let todo = await this.get(todoEditDto.id, user);

    if (!todo) {
      return null;
    }

    todo = this.todoRepository.merge(todo, todoEditDto);
    return await this.todoRepository.save(todo);
  }

  async delete(todoId: string, user: User): Promise<boolean> {
    let todo = await this.get(todoId, user);

    if (!todo) {
      return false;
    }

    await this.todoRepository.remove(todo);
    return true;
  }
}
