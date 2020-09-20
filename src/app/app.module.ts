import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodoModule } from '@todo/todo.module';
import { UserModule } from '@user/user.module';
import { AuthModule } from '@auth/auth.module';

/**
 * Módulo principal
 * 
 * Módulo responsável por importar e definir os submódulos e entidades
 * de toda a aplicação
 */
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [__dirname + '/**/models/*.entity{.ts,.js}'],
      synchronize: false
    }),
    TodoModule,
    UserModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
