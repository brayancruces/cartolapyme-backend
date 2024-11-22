import { Module } from '@nestjs/common';
import { LettersService } from './letters.service';
import { LettersController } from './letters.controller';
import { Portfolio, PortfolioSchema } from 'src/schemas/portfolio.schema';
import { Letter, LetterSchema } from 'src/schemas/letter.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      { name: Portfolio.name, schema: PortfolioSchema },
      { name: Letter.name, schema: LetterSchema }
    ]),
  ],
  providers: [LettersService],
  controllers: [LettersController],
  exports: [LettersService],
})
export class LettersModule {}
