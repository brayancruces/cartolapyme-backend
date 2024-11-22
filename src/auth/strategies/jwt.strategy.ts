// src/auth/jwt.strategy.ts

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import * as dotenv from 'dotenv';
import { UsersService } from 'src/users/users.service';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

dotenv.config();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UsersService) {
    
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extrae el token del encabezado Authorization
      secretOrKey: 'secret', // La clave secreta del JWT
    });
  }

  async validate(payload: JwtPayload) {
    // Extrae el sub (ID del usuario) del payload del JWT
    const { sub } = payload;
    const user = await this.userService.findById(sub);

    if (!user) {
      throw new Error('Unauthorized');
    }

    return user;
  }
}
