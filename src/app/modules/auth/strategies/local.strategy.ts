import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '@auth/services/auth/auth.service';
import { UnauthorizedException, Injectable } from '@nestjs/common';

/**
 * Estratégia de autenticação com dados locais
 */
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  /**
   * Valida os dados do usuário
   * @param email Email do usuário
   * @param password Senha do usuário
   * @returns Usuário autenticado, se os dados de autenticação estiverem corretos
   */
  async validate(email: string, password: string): Promise<any> {
    const user = await this.authService.validateUser({ email, password });

    if (!user) {
      throw new UnauthorizedException(null, "Invalid credentials");
    }

    return user;
  }
}
