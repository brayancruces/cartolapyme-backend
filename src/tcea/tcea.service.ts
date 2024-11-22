import { BadRequestException, Injectable } from "@nestjs/common";
import { Invoice } from "src/schemas/factura.schema";
import { Letter } from "src/schemas/letter.schema";

@Injectable()
export class TceaService { 


    calculatePresentValue(document: any): number {
        const { amount, discountDate, dueDate, rateDiscount, rateType } = document;
      
        const timeInDays = (new Date(dueDate).getTime() - new Date(discountDate).getTime()) / (1000 * 60 * 60 * 24);
        if (timeInDays <= 0) {
          throw new Error('El plazo debe ser mayor a 0.');
        }
      
        // Convertir tasa nominal a diaria si es necesario
        const dailyRate =
          rateType === 'nominal' ? rateDiscount / 360 : Math.pow(1 + rateDiscount / 100, 1 / 360) - 1;
      
        // Factor de descuento
        const discountFactor = Math.pow(1 + dailyRate, timeInDays);
      
        // Calcular valor presente
        return amount / discountFactor;
      }
      
  /**
   * Calcula la TCEA para una cartera específica, filtrando por usuario y moneda.
   * @param documents Lista combinada de letras y facturas
   * @param portfolioDiscountDate Fecha de descuento de la cartera (opcional)
   */
  calculateTcea(
    documents: (Letter | Invoice)[],
    portfolioDiscountDate?: Date,
  ): number {
    
    let totalNPV = 0; // Valor presente neto acumulado
    let totalDiscountedAmount = 0; // Monto total descontado acumulado
  
    documents.forEach((doc) => {
      const { amount, discountDate, dueDate, rateDiscount, rateType, taxRate } = doc;
  
      // Validar que las fechas sean consistentes
      const timeInDays = (new Date(dueDate).getTime() - new Date(discountDate).getTime()) / (1000 * 60 * 60 * 24);
      if (timeInDays <= 0) {
        throw new BadRequestException(
          `El documento con código ${doc.code} tiene una fecha de vencimiento (${dueDate}) inválida respecto a la fecha de descuento (${discountDate}).`
        );
      }
  
      // Calcular el tiempo en años
      const timeInYears = timeInDays / 360;
  
      // Calcular el factor de descuento
      const factorDiscount =
        rateType === 'nominal'
          ? 1 + (rateDiscount / 100) * timeInYears // Tasa nominal
          : Math.pow(1 + rateDiscount / 100, timeInYears); // Tasa efectiva
      

      // Calcular el valor presente 
      const presentValue = amount / factorDiscount; 

  
      // Acumular valores
      totalNPV += presentValue;
      totalDiscountedAmount += amount;
    });
  
    // Calcular la TCEA
    const timeInYearsTotal = documents.reduce((acc, doc) => {
      const timeInDays = (new Date(doc.dueDate).getTime() - new Date(portfolioDiscountDate).getTime()) / (1000 * 60 * 60 * 24);
      return acc + timeInDays / 360; // Acumula el tiempo total en años
    }, 0) / documents.length; // Promedio del tiempo en años
  
    const tcea = Math.pow(totalDiscountedAmount / totalNPV, 1 / timeInYearsTotal) - 1;
  
    console.log(tcea * 100); // Devolver TCEA en porcentaje

    return parseFloat((tcea * 100).toFixed(2));
  }
}
