import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());

    console.log(requiredRoles)
    if (!requiredRoles) {
      return true; // Si no hay roles definidos, permite acceso.
    }

    const { user } = context.switchToHttp().getRequest(); // Obtiene el usuario del request.
    return requiredRoles.includes(user.role); // Verifica si el rol del usuario está permitido.
  }
}
