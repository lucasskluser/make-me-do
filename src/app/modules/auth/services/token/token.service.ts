import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Token, TokenType } from '@auth/models/token.entity';
import { Repository } from 'typeorm';
import { User } from '@user/models/user.entity';
import { JwtService } from '@nestjs/jwt';
import { randomBytes, createHmac } from 'crypto';

/**
 * Serviço de manipulação de tokens
 */
@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(Token) private tokenRepository: Repository<Token>,
    private jwtService: JwtService,
  ) {}

  /**
   * Gera um token de acesso
   * @param user Usuário
   * @param audience Audiência
   * @return Token de acesso
   */
  public async generateAccessToken(user: User, audience: string) {
    const savedTokens = await this.tokenRepository.find({
      where: {
        user: user,
        type: TokenType.ACCESS_TOKEN,
        audience: audience,
      },
    });

    await this.tokenRepository.remove(savedTokens);

    const payload = {
      sub: user.id,
      name: user.name,
      email: user.email,
      aud: audience,
    };

    const token = this.jwtService.sign(payload);

    await this.tokenRepository.save({
      type: TokenType.ACCESS_TOKEN,
      value: createHmac('sha512', user.id)
        .update(token)
        .digest('base64'),
      user: user,
      audience: audience,
    });

    return token;
  }

  /**
   * Gera um token de reautenticação
   * @param user Usuário
   * @param audience Audiência
   * @return Token de reautenticação
   */
  public async generateRefreshToken(user: User, audience: string) {
    const savedTokens = await this.tokenRepository.find({
      where: {
        user: user,
        type: TokenType.REFRESH_TOKEN,
        audience: audience,
      },
    });

    await this.tokenRepository.remove(savedTokens);

    const token = randomBytes(128).toString('base64');

    await this.tokenRepository.save({
      type: TokenType.REFRESH_TOKEN,
      value: createHmac('sha512', user.id)
        .update(token)
        .digest('base64'),
      user: user,
      audience: audience,
    });

    return token;
  }

  /**
   * Revoga todos os tokens de acesso emitidos para uma audiência de um usuário
   * @param user Usuário
   * @param audience Audiência
   */
  public async revokeAccessTokens(user: User, audience: string) {
    const savedTokens = await this.tokenRepository.find({
      where: {
        user: user,
        type: TokenType.ACCESS_TOKEN,
        audience: audience
      },
    });

    await this.tokenRepository.remove(savedTokens);
  }
  
  /**
   * Revoga todos os tokens de refresh emitidos para uma audiência de um usuário
   * @param user Usuário
   * @param audience Audiência
   */
  public async revokeRefreshTokens(user: User, audience: string) {
    const savedTokens = await this.tokenRepository.find({
      where: {
        user: user,
        type: TokenType.REFRESH_TOKEN,
        audience: audience
      },
    });

    await this.tokenRepository.remove(savedTokens);
  }

  /**
   * Valida um token de acesso
   * @param user Usuário
   * @param token Token de acesso
   * @param audience Audiência
   * @param payload Dados incluídos no token de acesso
   * @return Verdadeiro, se o token de acesso for válido, e falso em outros casos
   */
  public async isAccessTokenValid(
    user: User,
    token: string,
    audience: string,
    payload: any,
  ) {
    const base64AccessToken = createHmac('sha512', user.id)
      .update(token)
      .digest('base64');

    const savedToken = await this.tokenRepository.findOne({
      where: {
        value: base64AccessToken,
        audience: audience,
        user: user,
        type: TokenType.ACCESS_TOKEN,
      },
    });

    if (!savedToken || savedToken.value !== base64AccessToken) {
      return false;
    }

    if (new Date(payload.iat * 1000) < user.updatedAt) {
      return false;
    }

    return true;
  }

  /**
   * Verifica se o token de reautenticação é válido
   * @param user Usuário
   * @param audience Audiência
   * @param refreshToken Token de reautenticação
   * @return Verdadeiro, se o token de reautenticação for válido, e falso em outros casos
   */
  public async isRefreshTokenValid(
    user: User,
    audience: string,
    refreshToken: string,
  ) {
    const base64RefreshToken = createHmac('sha512', user.id)
      .update(refreshToken)
      .digest('base64');

    const savedToken = await this.tokenRepository.findOne({
      where: {
        value: base64RefreshToken,
        user: user,
        type: TokenType.REFRESH_TOKEN,
        audience: audience,
      },
    });

    if (!savedToken || savedToken.value !== base64RefreshToken) {
      return false;
    }

    await this.tokenRepository.remove(savedToken);

    return true;
  }
}
