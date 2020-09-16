import { IsString, IsEmail, Length, IsUUID } from 'class-validator'


export class UserDto {
    @IsUUID()
    id: string;

    @IsString()
    name: string;

    @IsEmail()
    email: string;
}

export class UserCreateDto {
    @IsString()
    name: string;

    @IsEmail()
    email: string;

    @IsString()
    @Length(8)
    password: string;
    
    @IsString()
    @Length(8)
    confirmPassword: string;
}

export class UserLoginDto {
    @IsEmail()
    email: string;

    @IsString()
    @Length(8)
    password: string;
}

export class UserUpdatePasswordDto {
    @IsUUID()
    id: string;

    @IsEmail()
    email: string;

    @IsString()
    @Length(8)
    password: string;

    @IsString()
    @Length(8)
    confirmPassword: string;
}