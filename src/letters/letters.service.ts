import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateLetterDto } from './dto/create-letter.dto';
import { Portfolio } from 'src/schemas/portfolio.schema';
import { Letter } from 'src/schemas/letter.schema';
import { UpdateLetterDto } from './dto/update-letter.dto';

@Injectable()
export class LettersService {
  constructor(
    @InjectModel(Letter.name) private readonly letterModel: Model<Letter>,
    @InjectModel(Portfolio.name) private readonly portfolioModel: Model<Portfolio>,
  ) {}

  async create(createLetterDto: CreateLetterDto, userId: string): Promise<Letter> {


    // Validar que la fecha de vencimiento sea posterior a la de descuento
    const timeInDays = (new Date(createLetterDto.dueDate).getTime() - new Date(createLetterDto.discountDate).getTime()) / (1000 * 60 * 60 * 24);
    if (timeInDays <= 0) {
        throw new BadRequestException(
        `La fecha de vencimiento  debe ser posterior a la fecha de descuento.`
        );
    }

    // Validar que la cartera existe
    const portfolio = await this.portfolioModel
      .findOne({ user: new Types.ObjectId(userId), currency: createLetterDto.currency })
      .exec();

    if (!portfolio) {
      throw new NotFoundException('Portfolio not found');
    }

    createLetterDto.currency = portfolio.currency
 
    // Crear la letra
    const letter = new this.letterModel({ portfolio: portfolio._id, ...createLetterDto});
    return letter.save();
  }

  async findByPortfolio(portfolioId: string): Promise<Letter[]> {
    return this.letterModel.find({ portfolio: portfolioId }).exec();
  }

  async getLettersByUserAndCurrency(userId: string, currency: string): Promise<Letter[]> {

    
    // Encontrar el portafolio del usuario (empresa) con la moneda indicada
    const portfolio = await this.portfolioModel
      .findOne({ user: new Types.ObjectId(userId), currency })
      .exec();

    if (!portfolio) {
      throw new Error('No se encontró un portafolio con esa moneda para el usuario.');
    }

    // Filtrar las letras asociadas al portafolio y el usuario
    return this.letterModel
      .find({ portfolio: portfolio._id })
      .exec();
  }

  async update(letterId: string, updateLetterDto: UpdateLetterDto): Promise<Letter> {
    const updatedLetter = await this.letterModel.findByIdAndUpdate(
      letterId,
      { $set: updateLetterDto },
      { new: true, runValidators: true }, // Devuelve el documento actualizado y valida
    );

    if (!updatedLetter) {
      throw new NotFoundException(`Letter with ID "${letterId}" not found`);
    }

    return updatedLetter;
  }

  async delete(letterId: string): Promise<{ message: string }> {
    const result = await this.letterModel.findByIdAndDelete(letterId);
  
    if (!result) {
      throw new NotFoundException(`Letter with ID "${letterId}" not found`);
    }
  
    return { message: `Letter with ID "${letterId}" has been deleted` };
  }
}
