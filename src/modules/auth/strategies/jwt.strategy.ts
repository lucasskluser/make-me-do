import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { jwtConstants } from '../constants';
import { UserService } from '@modules/user/services/user/user.service';
import { TokenService } from '../services/token/token.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private userService: UserService,
    private tokenService: TokenService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
      issuer: jwtConstants.issuer,
      passReqToCallback:true
    });
  }

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
