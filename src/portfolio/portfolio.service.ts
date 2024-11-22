import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Invoice } from 'src/schemas/factura.schema';
import { Letter } from 'src/schemas/letter.schema';
import { Portfolio } from 'src/schemas/portfolio.schema';
import { User } from 'src/schemas/user.schema';
@Injectable()
export class PortfolioService {
  constructor(
    @InjectModel(Portfolio.name) private portfolioModel: Model<Portfolio>,
    @InjectModel(Letter.name) private letterModel: Model<Letter>,
    @InjectModel(Invoice.name) private invoiceModel: Model<Invoice>,
    @InjectModel(User.name) private userModel: Model<User> // Inyectar modelo de 'User'
  ) {}

  // Crear una nueva cartera asociada a un usuario (empresa)
  async createPortfolio(createPortfolioDto: any, userId: string): Promise<Portfolio> {
    const user = await this.userModel.findById(userId); // Buscar al usuario (empresa)
    const createdPortfolio = new this.portfolioModel({
      ...createPortfolioDto,
      user: user._id, // Asignar el usuario (empresa) al portfolio
    });
    return createdPortfolio.save();
  }

  // Otros métodos como agregar letras, agregar facturas, obtener carteras, etc.
}
