import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service'; // Servicio de usuarios
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { UserRole } from 'src/schemas/user.schema';
import { LoginDto } from './dto/login.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Portfolio } from 'src/schemas/portfolio.schema';
import { Model, Types } from 'mongoose';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    @InjectModel(Portfolio.name) private portfolioModel: Model<Portfolio>
  ) {}

  // Validar credenciales
  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);

    console.log(user)

    if (user && (await bcrypt.compare(password, user.password))) {
      const { name, email, role } = user; // Excluir contraseña
      const id = user._id.toString()
      return { name, email, role, id};
    }
    throw new UnauthorizedException('Credenciales inválidas');
  }

  // Generar token JWT
  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);

    const payload = { email: user.email, sub: user.id, role: user.role, name: user.name }; 


    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(registerDto: RegisterDto) {
    const { email, password, name } = registerDto;

    // Verificar si el usuario ya existe
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new UnauthorizedException('Usuario ya registrado');
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear un nuevo usuario
    const newUser = await this.usersService.create({
      name,
      email,
      password: hashedPassword,
      role: UserRole.COMPANY,
    }); 

    console.log(newUser)

    // Crear cartera en soles
    const portfolioSoles = new this.portfolioModel({
        name: `${newUser.name} - Cartera en Soles`,
        currency: 'PEN',
        discountDate: new Date(),
        letters: [],
        invoices: [],
        interestRate: 0,
        tcea: 0,
        user: newUser._id,
    });

    // Crear cartera en dólares
    const portfolioDolares = new this.portfolioModel({
        name: `${newUser.name} - Cartera en Dólares`,
        currency: 'USD',
        discountDate: new Date(),
        letters: [],
        invoices: [],
        interestRate: 0,
        tcea: 0,
        user: newUser._id,
    });

    // Guardar ambas carteras
    await Promise.all([portfolioSoles.save(), portfolioDolares.save()]);

    return this.login({ email, password: registerDto.password }); // Regresar el token después de registrar
  }
  
}
