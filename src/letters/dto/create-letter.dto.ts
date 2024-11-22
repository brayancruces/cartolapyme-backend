import { IsString, IsNotEmpty, IsNumber, IsDate, IsEnum, IsOptional, IsMongoId } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateLetterDto {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  issueDate: Date;

  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  discountDate: Date;

  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  dueDate: Date;

  @IsEnum(['nominal', 'effective'])
  @IsNotEmpty()
  rateType: string;

  @IsNumber()
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
