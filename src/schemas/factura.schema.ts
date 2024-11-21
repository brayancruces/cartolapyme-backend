import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Invoice {
  @Prop({ required: true })
  code: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  issueDate: Date;

  @Prop({ required: true })
  dueDate: Date;

  @Prop({ required: true })
  taxRate: number; // Tasa específica de impuestos

  @Prop({ required: true })
  client: string;

  @Prop({ enum: ['PEN', 'USD'], required: true })
  currency: string;
}
export const InvoiceSchema = SchemaFactory.createForClass(Invoice);