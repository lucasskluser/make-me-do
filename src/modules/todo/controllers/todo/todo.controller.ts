import {
  Controller,
  Get,
  Post,
  Request,
  Body,
  UseGuards,
  Param,
  NotFoundException,
  HttpCode,
  Put,
  Delete,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { TodoService } from '@modules/todo/services/todo/todo.service';
import { Todo } from '@modules/todo/models/todo.entity';
import { TodoDto, TodoEditDto } from '@modules/todo/validations/todo.dto';
import { JwtAuthGuard } from '@modules/auth/guards/jwt.guard';

/**
 * Controller de tarefas
 */
@Controller('todo')
@UseGuards(JwtAuthGuard)
export class TodoController {
  constructor(private todoService: TodoService) {}

  /**
   * Retorna todas as tarefas do usuário autenticado
   * @param req Requisição
   */
  @Get()
  async getAll(@Request() req: any): Promise<Todo[]> {
    return await this.todoService.getAll(req.user);
  }

  /**
   * Retorna uma tarefa pelo ID
   * @param req Requisição
   * @param id ID da tarefa
   * @throws `NotFoundException`, se a tarefa não for encontrada
   */
  @Get('/:id')
  async get(@Request() req: any, @Param('id') id: string) {
    const todo = await this.todoService.get(id, req.user);

    if (!todo) {
      throw new NotFoundException(null, 'Todo not found');
    }

    return todo;
  }

  /**
   * Cria uma tarefa
   * @param req Requisição
   * @param body Dados da tarefa
   * @returns Tarefa criada
   */
  @Post()
  @HttpCode(201)
  async create(@Request() req: any, @Body() body: TodoDto): Promise<Todo> {
    return await this.todoService.create(body, req.user);
  }

  /**
   * Atualiza uma tarefa
   * @param req Requisição
   * @param id ID da tarefa
   * @param body Dados da tarefa
   * @throws `BadRequestException`, se o ID no corpo da requisição for diferente do ID na URL
   * @returns Tarefa atualizada
   */
  @Put('/:id')
  @HttpCode(200)
  async put(
    @Request() req: any,
    @Param('id') id: string,
    @Body() body: TodoEditDto,
  ): Promise<Todo> {
    if (id !== body.id) {
      throw new BadRequestException(
        null,
        'The ID in the request body is different from the one informed in the url',
      );
    }

    const todo = await this.todoService.get(body.id, req.user);

    if (!todo) {
      throw new NotFoundException(null, 'Todo not found');
    }

    return await this.todoService.update(body, req.user);
  }

  /**
   * Deleta uma tarefa pelo ID
   * @param req Requisição
   * @param id ID da tarefa
   * @throws `NotFoundException`, se a tarefa não for encontrada
   * @throws `InternalServerErrorException`, se não for possível deletar a tarefa
   */
  @Delete('/:id')
  @HttpCode(204)
  async delete(@Request() req: any, @Param('id') id: string) {
    const todo = await this.todoService.get(id, req.user);

    if (!todo) {
      throw new NotFoundException(null, 'Todo not found');
    }

    const deleted = await this.todoService.delete(id, req.user);

    if (!deleted) {
      throw new InternalServerErrorException(null, 'Internal server error');
    }
  }
}
