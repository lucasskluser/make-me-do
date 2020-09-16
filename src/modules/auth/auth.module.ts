import { Module } from '@nestjs/common';
import { AuthService } from './services/auth/auth.service';
import { AuthController } from './controllers/auth/auth.controller';
import { UserModule } from '@modules/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { JwtStrategy } from './strategies/jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Token } from './models/token.entity';
import { TokenService } from './services/token/token.service';

@Module({
  imports: [
    UserModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '15m', issuer: jwtConstants.issuer },
    }),
    TypeOrmModule.forFeature([Token]),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, TokenService],
  controllers: [AuthController],
})
export class AuthModule {}
