import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Letter } from './letter.schema';
import { Invoice } from './factura.schema';

export type PortfolioDocument = Portfolio & Document;

@Schema()
export class Portfolio {
  @Prop({ required: true })
  discountDate: Date; // Fecha de descuento de la cartera

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Letter' }] })
  letters: Types.ObjectId[]; // Referencia a las letras

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Invoice' }] })
  invoices: Types.ObjectId[]; // Referencia a las facturas

  @Prop({ required: true })
  tcea: number; // TCEA total de la cartera
}

export const PortfolioSchema = SchemaFactory.createForClass(Portfolio);
