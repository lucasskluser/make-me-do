import {
  Controller,
  Post,
  Request,
  UseGuards,
  HttpCode,
  Headers,
  Body,
  Put,
  UnauthorizedException,
  Delete,
} from '@nestjs/common';
import { LocalAuthGuard } from '@modules/auth/guards/local.guard';
import { AuthService } from '@modules/auth/services/auth/auth.service';
import { RefreshTokenDto } from '@modules/auth/validations/refreshToken.dto';
import { Console } from 'console';
import { JwtAuthGuard } from '@modules/auth/guards/jwt.guard';

/**
 * Controller de autenticação
 */
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * Endpoint para autenticar o usuário
   * @param request Requisição
   * @return Tokens de autenticação
   * @return 401, se os dados estiverem incorretos
   */
  @Post()
  @HttpCode(201)
  @UseGuards(LocalAuthGuard)
  public async post(@Request() request: any) {
    return this.authService.login(request.user, request.headers['user-agent']);
  }

  /**
   * Endpoint para reautenticar o usuário
   * @param authorization Cabeçalho de autenticação
   * @param request Requisição
   * @param token Refresh Token
   * @return Tokens de autenticação
   * @return 401, se o refresh token for inválido
   */
  @Put()
  @HttpCode(201)
  public async put(
    @Headers('Authorization') authorization: string,
    @Request() request: any,
    @Body() token: RefreshTokenDto,
  ) {
    if (!authorization) {
      throw new UnauthorizedException();
    }

    const refreshToken = await this.authService.refresh(
      authorization,
      request.headers['user-agent'],
      token.refreshToken,
    );

    if (!refreshToken) {
      throw new UnauthorizedException();
    }

    return refreshToken;
  }

  @Delete()
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  public async delete(@Request() request: any) {
    await this.authService.logout(request.user, request.headers['user-agent']);
  }
}
