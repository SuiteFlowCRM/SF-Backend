import { Controller, Post, Body, Get, Put, Param, Query, Delete } from '@nestjs/common';
import { CardsService } from './cards.service';

@Controller('cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) { }

  @Post()
  async createCard(@Body() cardData: any): Promise<any> {
    return this.cardsService.createCard(cardData);
  }

  @Get('filtered')
  async findAllFiltered(
    @Query('tipoParticipante') tipoParticipante: string,
    @Query('idUser') idUser: string,
    @Query('empresa') empresa: string,
    @Query('listaAfilhados') listaAfilhados?: { name: string, id: string }[]
  ): Promise<any[]> {

    return this.cardsService.findAllFiltered(tipoParticipante, idUser, empresa, listaAfilhados);
  }

  // @Get('filtered')
  // async findAllFiltered(
  //   @Query('tipoParticipante') tipoParticipante: string,
  //   @Query('idUser') idUser: string,
  //   @Query('listaAfilhados') listaAfilhados?: { name: string, id: string }[]
  // ): Promise<any[]> {

  //   return this.cardsService.findAllFiltered(tipoParticipante, idUser, listaAfilhados);
  // }




  @Delete(':id')
  async deleteCard(@Param('id') cardId: number): Promise<void> {
    await this.cardsService.deleteCard(cardId);
  }

  @Put(':id')
  async updateCard(
    @Param('id') cardId: number,
    @Body() updatedCardData: any,
  ): Promise<any> {
    return this.cardsService.updateCard(cardId, updatedCardData);
  }

  @Put(':id/arquivar')
  async arquivateCard(
    @Param('id') cardId: number,
    @Body() updatedCardData: any,
  ): Promise<any> {
    return this.cardsService.arquivateCard(cardId, updatedCardData);
  }

}
