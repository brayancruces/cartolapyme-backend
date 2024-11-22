import { IsEmail, IsString, MinLength, IsEnum } from 'class-validator';

export class RegisterDto {
    @IsString({ message: 'El nombre debe ser una cadena de texto' })
    name: string;
  
    @IsEmail({}, { message: 'El email debe tener un formato válido' })
    email: string;
  
    @IsString({ message: 'La contraseña debe ser una cadena de texto' })
    @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
    password: string;
  
  }