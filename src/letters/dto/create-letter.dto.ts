import { IsString, IsNotEmpty, IsNumber, IsDate, IsEnum, IsOptional, IsMongoId, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateLetterDto {
  @IsString({ message: 'El código de la letra es obligatorio' })
  @IsNotEmpty({ message: 'El código de la letra no puede estar vacío' })
  code: string;

  @IsNumber({}, { message: 'El monto de la letra debe ser un número' })
  @Min(1, { message: 'El monto debe ser mayor que cero' })
  amount: number;

  @IsDate({ message: 'La fecha de emisión debe ser una fecha válida' })
  @Type(() => Date)
  @IsNotEmpty()
  issueDate: Date;

  @IsDate({ message: 'La fecha de descuento debe ser una fecha válida' })
  @Type(() => Date)
  @IsNotEmpty()
  discountDate: Date;

  @IsDate({ message: 'La fecha de vencimiento debe ser una fecha válida' })
  @Type(() => Date)
  @IsNotEmpty()
  dueDate: Date;

  @IsEnum(['nominal', 'effective'], { message: 'El tipo de tasa debe ser "nominal" o "effective"' })
  @IsNotEmpty()
  rateType: string;

  @IsNumber({}, { message: 'La tasa de descuento debe ser un número' })
  @IsNotEmpty()
  rateDiscount: number;

  @IsOptional()
  @IsString()
  client?: string;

  @IsEnum(['PEN', 'USD'])
  @IsOptional()
  currency?: string; // Informativo
  
  
  portfolio?: string; // ID de la cartera asociada
}
