import { Module } from '@nestjs/common';
import { TceaService } from './tcea.service';
import { TceaController } from './tcea.controller';
import { AuthModule } from 'src/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Portfolio, PortfolioSchema } from 'src/schemas/portfolio.schema';
import { LettersModule } from 'src/letters/letters.module';
import { InvoicesModule } from 'src/invoices/invoices.module';

@Module({
  imports: [
    AuthModule,
    LettersModule,
    InvoicesModule
  ],
  providers: [TceaService],
  controllers: [TceaController]
})
export class TceaModule {}
