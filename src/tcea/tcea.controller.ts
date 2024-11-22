import { LettersService } from "src/letters/letters.service";
import { TceaService } from "./tcea.service";
import { InvoicesService } from "src/invoices/invoices.service";
import { Controller, Get, Query, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/guards/jwt-auth.guard";
import { Letter } from "src/schemas/letter.schema";

@UseGuards(JwtAuthGuard)
@Controller('reports')
export class TceaController {
  constructor(
    private readonly tceaService: TceaService,
    private readonly letterService: LettersService,
    private readonly invoiceService: InvoicesService,
  ) {}

  @Get('tcea')
  async calculateTcea(
    @Req() req: any,
    @Query('currency') currency: string,
    @Query('discountDate') discountDate?: Date,
  ) {

    const userId = req.user._id; 

    // Obtener letras y facturas asociadas a la cartera, usuario y moneda
    const letters = await this.letterService.getLettersByUserAndCurrency(userId,currency);
    const invoices = await this.invoiceService.getInvoicesByUserAndCurrency(userId,currency);

    // Combinar documentos
    const documents = [...letters, ...invoices]; 

    documents.forEach((doc) => {
        console.log('Documento:', {
          amount: doc.amount,
          discountDate: doc.discountDate,
          dueDate: doc.dueDate,
          rateDiscount: doc.rateDiscount,
          rateType: doc.rateType,
          taxRate: doc.taxRate || 0,
        });
      });
      

    // Calcular TCEA
    const tcea = this.tceaService.calculateTcea(documents, discountDate);
    return { tcea };
  }

  @Get('list')
async generateReport(
  @Req() req: any,
  @Query('currency') currency: string,
  @Query('discountDate') discountDate?: Date
): Promise<any> {

    const userId = req.user._id; 
  // Obtener letras y facturas de la cartera filtradas por fecha y moneda
  const letters = await this.letterService.getLettersByUserAndCurrency(userId,currency);
  const invoices = await this.invoiceService.getInvoicesByUserAndCurrency(userId,currency);


  // Calcular el TCEA general
  const documents = [...letters, ...invoices];
  const tcea = this.tceaService.calculateTcea(documents, discountDate);

  // Generar el reporte
  const report = {
    discountDate: discountDate || 'Sin especificar',
    currency: currency || 'Todos',
    tcea,
    details: documents.map((doc) => ({
      type: doc instanceof Letter ? 'Factura' : 'Letra' ,
      code: doc.code,
      amount: doc.amount,
      discountDate: doc.discountDate,
      dueDate: doc.dueDate,
      rateDiscount: doc.rateDiscount,
      rateType: doc.rateType,
      taxRate: doc.taxRate || 0,
      presentValue: this.tceaService.calculatePresentValue(doc),
    })),
  };

  return report;
}
}
