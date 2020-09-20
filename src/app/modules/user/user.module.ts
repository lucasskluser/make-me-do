import { Module } from '@nestjs/common';
import { UserController } from './controllers/user/user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './models/user.entity';
import { UserService } from './services/user/user.service';

/**
 * Módulo de usuário
 * 
 * Módulo responsável por definir os controladores, serviços e entidades
 * referentes aos usuários da aplicação
 */
@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService]
})
export class UserModule {}
