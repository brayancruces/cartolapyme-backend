import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { Portfolio } from 'src/schemas/portfolio.schema';
import { Invoice } from 'src/schemas/factura.schema';

@Injectable()
export class InvoicesService {
  
  constructor(
    @InjectModel(Invoice.name) private readonly invoiceModel: Model<Invoice>,
    @InjectModel(Portfolio.name) private readonly portfolioModel: Model<Portfolio>,
  ) {}

  async create(createInvoiceDto: CreateInvoiceDto,  userId: string): Promise<Invoice> {


    // Validar que la fecha de vencimiento sea posterior a la de descuento
    const timeInDays = (new Date(createInvoiceDto.dueDate).getTime() - new Date(createInvoiceDto.discountDate).getTime()) / (1000 * 60 * 60 * 24);
    if (timeInDays <= 0) {
        throw new BadRequestException(
        `La fecha de vencimiento (${createInvoiceDto.dueDate}) debe ser posterior a la fecha de descuento (${createInvoiceDto.discountDate}).`
        );
    }

    // Validar que la cartera existe
    const portfolio = await this.portfolioModel
      .findOne({ user: new Types.ObjectId(userId), currency: createInvoiceDto.currency })
      .exec();

    if (!portfolio) {
      throw new NotFoundException('Portfolio not found');
    }

    createInvoiceDto.currency = portfolio.currency
    // Crear la factura
    const invoice = new this.invoiceModel({ portfolio: portfolio._id, ...createInvoiceDto});

    return invoice.save();
  }

  async findByPortfolio(portfolioId: string): Promise<Invoice[]> {
    return this.invoiceModel.find({ portfolio: portfolioId }).exec();
  }


  async getInvoicesByUserAndCurrency(userId: string, currency: string) {
    // Encontrar el portafolio del usuario (empresa) con la moneda indicada
    const portfolio = await this.portfolioModel
      .findOne({ user: new Types.ObjectId(userId), currency })
      .exec();

    if (!portfolio) {
      throw new Error('No se encontró un portafolio con esa moneda para el usuario.');
    }
    

    // Filtrar las letras asociadas al portafolio y el usuario
    return this.invoiceModel
      .find({ portfolio: portfolio._id })
      .exec();
  
  }
 
}
