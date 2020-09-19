import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '@modules/user/services/user/user.service';
import { TokenService } from '../services/token/token.service';
import Environment from 'environment';

/**
 * Estratégia de autenticação com JSON Web Token
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private userService: UserService,
    private tokenService: TokenService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: Environment.JWT_SECRET,
      issuer: Environment.JWT_ISSUER,
      passReqToCallback:true
    });
  }

  /**
   * Valida o token do usuário
   * @param request Requisição
   * @param payload Payload do JSON Web Token
   * @returns Dados do usuário do JSON Web Token, se o token for válido
   */
  async validate(request: any, payload: any) {
    const user = await this.userService.get(payload.sub)

    if (!user) {
      throw new UnauthorizedException();
    }

    if (!(await this.tokenService.isAccessTokenValid(user, request.headers.authorization.replace("Bearer ", ""), request.headers['user-agent'], payload))) {
      throw new UnauthorizedException();
    }

    return { id: payload.sub, name: payload.name, email: payload.email };
  }
}
