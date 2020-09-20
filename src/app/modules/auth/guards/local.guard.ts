import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Guardião de rotas com credenciais de login
 */
@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}
