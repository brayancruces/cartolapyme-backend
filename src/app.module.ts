import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { PortfolioModule } from './portfolio/portfolio.module';
import { LettersModule } from './letters/letters.module';
import { InvoicesModule } from './invoices/invoices.module';
import { TceaModule } from './tcea/tcea.module';

@Module({
  imports: [ConfigModule.forRoot({envFilePath: '.env', isGlobal: true}), 
    MongooseModule.forRoot(process.env.MONGO_URI), 
    UsersModule, 
    AuthModule, PortfolioModule, LettersModule, InvoicesModule, TceaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
