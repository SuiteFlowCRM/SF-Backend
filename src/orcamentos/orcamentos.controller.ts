import { Controller, Post, Body, Get, Put, Param, Query, Delete } from '@nestjs/common';
import { OrcamentosService } from './orcamentos.service';

@Controller('orcamentos')
export class OrcamentosController {

  constructor(private readonly orcamentosService: OrcamentosService) { }


  @Delete(':id')
  async deleteOrcamento(@Param('id') orcamentoId: number): Promise<void> {
    await this.orcamentosService.deleteOrcamento(orcamentoId);
  }

  @Put(':id')
  async updateCard(
    @Param('id') cardId: number,
    @Body() updatedCardData: any,
  ): Promise<any> {
    return this.orcamentosService.updateOrcamento(cardId, updatedCardData);
  }


  @Post()
  async createOrcamento(@Body() orcamentoData: any): Promise<any> {
    return this.orcamentosService.createOrcamento(orcamentoData);
  }

  @Get('getOrcamentos')
  async findOrcamento(
    @Query('tipoParticipante') tipoParticipante: string,
    @Query('id_user') idUser: string,
    @Query('empresa') empresa: string,
  ): Promise<any[]> {

    return this.orcamentosService.findOrcamento(tipoParticipante, idUser, empresa);
  }

  // Em OrcamentosController
  @Get('ultimo-number')
  async getLastOrcamentoNumber(): Promise<any> {
    const lastNumber = await this.orcamentosService.getLastOrcamentoNumber();
    return { lastNumber };
  }


  // // Rota para buscar os cards vendidos no último minuto
  // @Get('sold-last-minute')
  // async findSoldLastMinute(): Promise<any[]> {
  //   return this.orcamentosService.findSoldLastMinute();
  // }


  // @Get('filtered')
  // async findAllFiltered(
  //   @Query('tipoParticipante') tipoParticipante: string,
  //   @Query('idUser') idUser: string,
  //   @Query('empresa') empresa: string,
  //   @Query('startDate') startDate: string,
  //   @Query('listaAfilhados') listaAfilhados?: { name: string, id: string }[]
  // ): Promise<any[]> {

  //   return this.orcamentosService.findAllFiltered(tipoParticipante, idUser, empresa, listaAfilhados, startDate);
  // }



  // @Put(':id')
  // async updateCard(
  //   @Param('id') cardId: number,
  //   @Body() updatedCardData: any,
  // ): Promise<any> {
  //   return this.orcamentosService.updateCard(cardId, updatedCardData);
  // }

  // @Put(':id/arquivar')
  // async arquivateCard(
  //   @Param('id') cardId: number,
  //   @Body() updatedCardData: any,
  // ): Promise<any> {
  //   return this.orcamentosService.arquivateCard(cardId, updatedCardData);
  // }

}
