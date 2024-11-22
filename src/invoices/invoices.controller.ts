import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { InvoicesService } from './invoices.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';

@Controller('invoices')
@UseGuards(JwtAuthGuard) 
export class InvoicesController {

    constructor(private readonly invoicesService: InvoicesService) {}

  // Obtener facturas por moneda (currency) de la cartera y el userId del JWT
  @Get('portfolio/:currency')
  async getInvoices(
    @Param('currency') currency: string, // Moneda del portafolio (PEN o USD)
    @Req() req: any, // Obtener el userId desde el JWT
  ) {
    const userId = req.user._id; 
    return this.invoicesService.getInvoicesByUserAndCurrency(userId, currency);
  }

  // Crear una nueva factura
  @Post()
  async createInvoice(@Body() createInvoiceDto: CreateInvoiceDto, @Req() req: any) {

    const userId = req.user._id; 
    return this.invoicesService.create(createInvoiceDto, userId);

  }

  @Delete(':id')
  async deleteLetter(@Param('id') letterId: string) {
    return this.invoicesService.delete(letterId);
  }
  
}
