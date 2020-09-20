import { Module } from '@nestjs/common';
import { AuthService } from '@auth/services/auth/auth.service';
import { AuthController } from '@auth/controllers/auth/auth.controller';
import { UserModule } from '@user/user.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from '@auth/strategies/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '@auth/strategies/jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Token } from '@auth/models/token.entity';
import { TokenService } from '@auth/services/token/token.service';
import Environment from '@src/environment';

/**
 * Módulo de autenticação
 *
 * Módulo responsável por definir os controladores, serviços e entidades
 * referentes ao processo de autenticação de usuários
 */
@Module({
  imports: [
    UserModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: Environment.JWT_SECRET,
      signOptions: {
        expiresIn: Environment.JWT_EXPIRATION,
        issuer: Environment.JWT_ISSUER,
      },
    }),
    TypeOrmModule.forFeature([Token]),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, TokenService],
  controllers: [AuthController],
})
export class AuthModule {}
