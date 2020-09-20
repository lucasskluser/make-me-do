import { IsString } from "class-validator";

/**
 * Objeto de transferência de dados de `Refresh Token` de usuário
 */
export class RefreshTokenDto {
    /**
     * Refresh token do usuário
     */
    @IsString()
    refreshToken: string;
}