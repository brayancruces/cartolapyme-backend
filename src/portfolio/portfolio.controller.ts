import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { PortfolioService } from './portfolio.service';

@Controller('portfolio')
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  // Crear una nueva cartera asociada a un usuario (empresa)
  @Post(':userId')
  async create(
    @Body() createPortfolioDto: any,
    @Param('userId') userId: string // Obtener el ID del usuario (empresa)
  ) {
    return this.portfolioService.createPortfolio(createPortfolioDto, userId);
  }

  // Otros métodos como agregar letras, agregar facturas, obtener carteras, etc.
}
