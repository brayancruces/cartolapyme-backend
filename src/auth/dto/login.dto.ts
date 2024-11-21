import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6) // Aseguramos que la contraseña tenga al menos 6 caracteres
  password: string;
}
