import { Module } from '@nestjs/common';
import { AuthService } from './services/auth/auth.service';
import { AuthController } from './controllers/auth/auth.controller';
import { UserModule } from '@modules/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Token } from './models/token.entity';
import { TokenService } from './services/token/token.service';
import Environment from 'environment';

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
      signOptions: { expiresIn: Environment.JWT_EXPIRATION, issuer: Environment.JWT_ISSUER },
    }),
    TypeOrmModule.forFeature([Token]),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, TokenService],
  controllers: [AuthController],
})
export class AuthModule {}
