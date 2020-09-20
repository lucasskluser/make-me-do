import {
  Controller,
  Body,
  Post,
  Get,
  Request,
  UseGuards,
  NotFoundException,
  Put,
  Delete,
  HttpCode,
  ConflictException,
  UnprocessableEntityException,
  BadRequestException,
} from '@nestjs/common';
import {
  UserCreateDto,
  UserDto,
  UserUpdatePasswordDto,
} from '@user/validations/user.dto';
import { UserService } from '@user/services/user/user.service';
import { JwtAuthGuard } from '@auth/guards/jwt.guard';

/**
 * Controller de usuário
 */
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * Retorna os dados do usuário autenticado
   * @guard JwtAuthGuard
   * @param req Requisição
   * @throws `NotFoundException`, se o usuário não foi encontrado
   */
  @Get()
  @UseGuards(JwtAuthGuard)
  async get(@Request() req: any) {
    const user = await this.userService.get(req.user.id);

    if (!user) {
      throw new NotFoundException(null, 'User not found');
    }

    return user;
  }

  /**
   * Cria um novo usuário
   * @param body Corpo da requisição
   * @throws `UnprocessableEntityException`, se existe um valor inválido na requisição
   * @throws `ConflictException`, se o email informado já está sendo utilizado
   * @returns Dados do usuário criado com HTTP Status code 200, se o usuário foi criado
   */
  @Post()
  @HttpCode(201)
  async post(@Body() body: UserCreateDto) {
    if (body.password !== body.confirmPassword) {
      throw new UnprocessableEntityException(
        null,
        'The password and password confirmation should be equal',
      );
    }

    if (await this.userService.userExistsByEmail(body.email)) {
      throw new ConflictException(null, 'This email is already being used');
    }

    return await this.userService.create(body);
  }

  /**
   * Atualiza os dados do usuário
   * @param req Requisição
   * @param body Corpo da requisição
   * @throws `NotFoundException`, se o usuário não foi encontrado
   * @throws `BadRequestException`, se o ID informado no corpo da requisição for diferente do informado na URL
   * @returns Dados atualizados do usuário com HTTP Status Code 200, se o usuário foi atualizado
   */
  @Put()
  @UseGuards(JwtAuthGuard)
  async put(@Request() req: any, @Body() body: UserDto) {
    const user = await this.userService.get(req.user.id);

    if (!user) {
      throw new NotFoundException(null, 'User not found');
    }

    if (user.id !== body.id) {
      throw new BadRequestException(
        null,
        'The ID in the request body is different from the one informed in the url',
      );
    }

    return await this.userService.update(body);
  }

  /**
   * Atualiza a senha do usuário
   * @param req Requisição
   * @param body Corpo da requisição
   * @throws `NotFoundException`, se o usuário não foi encontrado
   * @throws `BadRequestException`, se o ID informado no corpo da requisição for diferente do informado na URL
   * @returns Dados do usuário com HTTP Status Code 200, se a senha do usuário foi atualizada
   */
  @Put('/password')
  @UseGuards(JwtAuthGuard)
  async putPassword(@Request() req: any, @Body() body: UserUpdatePasswordDto) {
    const user = await this.userService.get(req.user.id);

    if (!user) {
      throw new NotFoundException(null, 'User not found');
    }

    if (user.id !== body.id) {
      throw new BadRequestException(
        null,
        'The ID in the request body is different from the one informed in the url',
      );
    }

    return await this.userService.updatePassword(body);
  }

  /**
   * Marca um usuário como deletado
   * @param req Requisição
   * @throws `NotFoundException`, se o usuário não foi encontrado
   * @returns 204, se o usuário foi marcado como deletado
   */
  @Delete()
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  async delete(@Request() req: any) {
    const user = await this.userService.get(req.user.id);

    if (!user) {
      throw new NotFoundException(null, 'User not found');
    }

    await this.userService.disable(user);
  }
}
