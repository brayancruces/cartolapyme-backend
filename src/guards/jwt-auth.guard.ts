import { Injectable  } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  // Aquí no necesitas agregar lógica adicional, solo extiende de AuthGuard.
}
