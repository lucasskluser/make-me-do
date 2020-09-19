import { IsString, IsEmail, Length, IsUUID } from 'class-validator'

/**
 * Objeto de transferência de dados de usuário
 */
export class UserDto {
    /**
     * Chave primária do usuário
     */
    @IsUUID()
    id: string;

    /**
     * Nome do usuário
     */
    @IsString()
    name: string;

    /**
     * Email do usuário
     */
    @IsEmail()
    email: string;
}

/**
 * Objeto de transferência de dados de criação de usuário
 */
export class UserCreateDto {
    /**
     * Nome do usuário
     */
    @IsString()
    name: string;

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
    
    /**
     * Confirmação de senha do usuário
     */
    @IsString()
    @Length(8)
    confirmPassword: string;
}

/**
 * Objeto de transferência de dados de autenticação de usuário
 */
export class UserLoginDto {
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

/**
 * Objeto de transferência de dados de atualização de senha de usuário
 */
export class UserUpdatePasswordDto {
    /**
     * Chave primária do usuário
     */
    @IsUUID()
    id: string;

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

    /**
     * Confirmação de senha do usuário
     */
    @IsString()
    @Length(8)
    confirmPassword: string;
}