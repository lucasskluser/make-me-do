import { IsEmail, IsString, Length } from 'class-validator';

/**
 * Objeto de transferência de dados de autenticação de usuário
 */
export class LoginDto {
  /**
   * Email do usuário
   */
  @IsEmail()
  email: string;

  /**
   * Senha do usuário
   */
  @IsString()
  @Length(8)
  password: string;
}
