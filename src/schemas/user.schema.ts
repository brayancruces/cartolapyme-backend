import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';


// Definir el enum para los roles
export enum UserRole {
    ADMIN = 'administrador',
    COMPANY = 'empresa',
}


export type UserDocument = User & Document;


@Schema({collection:'users'})
export class User extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, enum: UserRole }) // Usamos el enum aquí para validar los roles
  role: UserRole;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
