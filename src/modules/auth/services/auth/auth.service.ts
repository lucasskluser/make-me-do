import { Injectable } from '@nestjs/common';
import { UserService } from '@modules/user/services/user/user.service';
import { LoginDto } from '@modules/auth/validations/login.dto';
import { JwtService } from '@nestjs/jwt';
import { User } from '@modules/user/models/user.entity';
import { TokenService } from '../token/token.service';

/**
 * Serviço de autenticação
 */
@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private tokenService: TokenService,
    private jwtService: JwtService,
  ) {}

  /**
   * Valida os dados de autenticação do usuário
   * @param loginDto Dados de autenticação
   * @return O usuário autenticado
   * @return null, se os dados estiverem incorretos
   */
  public async validateUser(loginDto: LoginDto) {
    const user = await this.userService.getByEmail(loginDto.email);

    if (!user) {
      return null;
    }

    const passwordValid = await this.userService.isPasswordValid(
      user,
      loginDto.password,
    );

    if (!passwordValid) {
      return null;
    }

    return user;
  }

  /**
   * Gera tokens de autenticação
   * @param user Usuário
   * @param audience Audiência
   * @return Tokens de autenticação
   */
  public async login(user: User, audience: string) {
    return {
      accessToken: await this.tokenService.generateAccessToken(user, audience),
      refreshToken: await this.tokenService.generateRefreshToken(user, audience),
    };
  }

  /**
   * Gera novos tokens de autenticação
   * @param authorizationHeader Cabeçalho de autorização
   * @param audience Audiência da requisição
   * @param refreshToken Refresh Token
   * @return Tokens de autenticação
   * @return null, se o refresh token for inválido
   */
  public async refresh(authorizationHeader: string, audience: string, refreshToken: string) {
    try {
      const payload = this.jwtService.decode(
        authorizationHeader.replace('Bearer ', '').trim(),
      );

      const user = await this.userService.get(payload['sub']);

      if (
        !user ||
        !(await this.tokenService.isRefreshTokenValid(user, audience, refreshToken))
      ) {
        return null;
      }

      return await this.login(user, audience);
    } catch {
      return null;
    }
  }

  public async logout(user: User, audience: string) {
    await this.tokenService.revokeAccessTokens(user, audience);
    await this.tokenService.revokeRefreshTokens(user, audience);
  }
}
