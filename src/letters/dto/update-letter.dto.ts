// src/letters/dtos/update-letter.dto.ts
import { IsOptional, IsString, IsNumber, IsDate, IsEnum } from 'class-validator';

export class UpdateLetterDto {
  @IsOptional()
  @IsString()
  code?: string;

  @IsOptional()
  @IsNumber()
  amount?: number;

  @IsOptional()
  @IsDate()
  issueDate?: Date;

  @IsOptional()
  @IsDate()
  discountDate?: Date;


  @IsOptional()
  @IsDate()
  dueDate?: Date;

  @IsOptional()
  @IsEnum(['nominal', 'effective'])
  rateType?: string;

  @IsOptional()
  @IsNumber()
  rateDiscount?: number;

  @IsOptional()
  @IsString()
  client?: string;
}
