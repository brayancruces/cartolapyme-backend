
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Letter } from './letter.schema';
import { Invoice } from './factura.schema';
import { User } from './user.schema';

@Schema({collection:'portafolio'})
export class Portfolio extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  currency: string; // Moneda de la cartera (por ejemplo, PEN o USD)

  @Prop({ required: true })
  discountDate: Date; // Fecha de descuento general de la cartera

  @Prop({ type: [Types.ObjectId], ref: 'Letter' })
  letters: Letter[]; // Referencia a las letras asociadas

  @Prop({ type: [Types.ObjectId], ref: 'Invoice' })
  invoices: Invoice[]; // Referencia a las facturas asociadas

  @Prop({ required: true })
  interestRate: number; // Tasa de interés base para la cartera

  @Prop({ required: true })
  tcea: number; // Tasa de Coste Efectivo Anual (calculada para la cartera completa)

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: User; // Usuario (empresa) dueño de la cartera
}


export const PortfolioSchema = SchemaFactory.createForClass(Portfolio);
