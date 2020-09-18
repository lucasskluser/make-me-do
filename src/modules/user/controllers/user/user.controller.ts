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
} from '@nestjs/common';
import { UserCreateDto, UserDto, UserUpdatePasswordDto } from '@modules/user/validations/user.dto';
import { UserService } from '@modules/user/services/user/user.service';
import { JwtAuthGuard } from '@modules/auth/guards/jwt.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async get(@Request() req: any) {
    const user = await this.userService.get(req.user.id);

    if (!user) {
      throw new NotFoundException(null, 'User not found');
    }

    return user;
  }

  @Post()
  @HttpCode(201)
  async post(@Body() body: UserCreateDto) {
    if (body.password !== body.confirmPassword) {
      throw new UnprocessableEntityException(null, 'The password and password confirmation should be equal')
    }

    if (await this.userService.userExistsByEmail(body.email)) {
      throw new ConflictException(null, 'This email is already being used');
    }

    return await this.userService.create(body);
  }

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
