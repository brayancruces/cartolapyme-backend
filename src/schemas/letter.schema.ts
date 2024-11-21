import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Letter {
  @Prop({ required: true })
  code: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  issueDate: Date;

  @Prop({ required: true })
  dueDate: Date;

  @Prop({ required: true })
  rate: number;

  @Prop({ required: true })
  client: string;

  @Prop({ enum: ['PEN', 'USD'], required: true })
  currency: string;
}
export const LetterSchema = SchemaFactory.createForClass(Letter);
