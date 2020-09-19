import { Injectable } from '@nestjs/common';
import { Todo } from '@modules/todo/models/todo.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TodoDto, TodoEditDto } from '@modules/todo/validations/todo.dto';
import { User } from '@modules/user/models/user.entity';

/**
 * Serviço de manipulação de tarefas
 */
@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo) private readonly todoRepository: Repository<Todo>,
  ) {}

  /**
   * Obtém uma tarefa pelo ID
   * @param id ID da tarefa
   * @param user Usuário da tarefa
   */
  async get(id: string, user: User): Promise<Todo> {
    return await this.todoRepository.findOne({ where: { id, user: { id: user.id} }});
  }

  /**
   * Obtém todas as tarefas de um usuário
   * @param user Usuário das tarefas
   */
  async getAll(user: User): Promise<Todo[]> {
    return await this.todoRepository.find({ where: { user: { id: user.id} } });
  }

  /**
   * Cria uma tarefa
   * @param todoDto Dados da tarefa
   * @param user Usuário da tarefa
   * @returns Tarefa criada
   */
  async create(todoDto: TodoDto, user: User): Promise<Todo> {
    return await this.todoRepository.save({ ...todoDto, user: user });
  }

  /**
   * Atualiza os dados de uma tarefa
   * @param todoEditDto Dados da tarefa
   * @param user Usuário da tarefa
   * @returns Tarefa editada ou `null` se a tarefa não for encontrada
   */
  async update(todoEditDto: TodoEditDto, user: User): Promise<Todo> {
    let todo = await this.get(todoEditDto.id, user);

    if (!todo) {
      return null;
    }

    todo = this.todoRepository.merge(todo, todoEditDto);
    return await this.todoRepository.save(todo);
  }

  /**
   * Deleta uma tarefa
   * @param todoId ID da tarefa
   * @param user Usuário da tarefa
   * @returns Verdadeiro, se a tarefa for deletada e falso em outros casos
   */
  async delete(todoId: string, user: User): Promise<boolean> {
    const todo = await this.get(todoId, user);

    if (!todo) {
      return false;
    }

    await this.todoRepository.remove(todo);
    return true;
  }
}
