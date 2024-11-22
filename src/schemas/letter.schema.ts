import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Portfolio } from './portfolio.schema';
import { Types } from 'mongoose';


@Schema({collection:'user_letters'})
export class Letter {
  @Prop({ required: true })
  code: string; // Una referencia interna de su letra. Ejem: LET-001. Solo referencial

  @Prop({ required: true }) 
  amount: number; // Monto

  @Prop({ required: true }) // Fecha de emision
  issueDate: Date;

  @Prop({ required: true }) // Fecha en que se aplica el descuento
  discountDate: Date;

  
  
  @Prop({ required: true })
  dueDate: Date; // Fecha de vencimiento

  @Prop({ required: true, enum: ['nominal', 'effective'] })
  rateType: string; // Tipo de tasa: nominal o efectiva

  @Prop({ required: true })
  rateDiscount: number;   // Tasa de descuento. (por ejemplo, 12%)

  @Prop({ required: false })
  taxRate?: number; // Tasa específica de impuestos. Ejem: 18 (IGV)

  @Prop({ required: false })
  client?: string; // Nombre de empresa: CRAYONICO SAC, opcional

  @Prop({ enum: ['PEN', 'USD'], required: false })
  currency?: string; // Uso informativo, se define cuando se esta creando buscando la moneda padre del portafolio
   
  //
  @Prop({ type: Types.ObjectId, ref: 'Portfolio', required: true })
  portfolio: Portfolio; // Referencia a la cartera asociada
  
}
export const LetterSchema = SchemaFactory.createForClass(Letter);
