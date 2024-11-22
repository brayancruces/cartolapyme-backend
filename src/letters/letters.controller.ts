import { Controller, Post, Body, Get, Param, UseGuards, Req, Patch, Delete } from '@nestjs/common';
import { LettersService } from './letters.service';
import { CreateLetterDto } from './dto/create-letter.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { UpdateLetterDto } from './dto/update-letter.dto';

@Controller('letters')
@UseGuards(JwtAuthGuard)
export class LettersController {
  constructor(private readonly lettersService: LettersService) {}
  

  @Post()
  async create(@Body() createLetterDto: CreateLetterDto, @Req() req: any) {

    const userId = req.user._id; 
    return this.lettersService.create(createLetterDto, userId);
  }

  @Patch(':id')
  async updateLetter(
    @Param('id') letterId: string,
    @Body() updateLetterDto: UpdateLetterDto,
  ) {
    return this.lettersService.update(letterId, updateLetterDto);
  }


  @Delete(':id')
  async deleteLetter(@Param('id') letterId: string) {
    return this.lettersService.delete(letterId);
  }
  

  @Get('portfolio/:currency')
  async findByPortfolio( @Param('currency') currency: string,
  @Req() req: any) { 

    const userId = req.user._id; 
    return this.lettersService.getLettersByUserAndCurrency(userId, currency);
  } 



}
