import { Controller, Post, Body, Get, Put, Param, Query, Delete } from '@nestjs/common';
import { ProcessoService } from './processo.service';

@Controller('processo')
export class ProcessoController {
  
  constructor(private readonly processoService: ProcessoService) { }

  @Post()
  async createProcesso(@Body() newProcesso: any): Promise<any> {
    return this.processoService.createProcesso(newProcesso);
  }

  @Get('getProcesso')
  async findAllFiltered(
    @Query('empresa') empresa: string,
  ): Promise<any[]> {

    return this.processoService.findAllFiltered(empresa);
  }

  @Put(':id')
  async updateProcesso(
    @Param('id') processoId: number,
    @Body() updatedProcessoData: any,
  ): Promise<any> {
    return this.processoService.updateProcesso(processoId, updatedProcessoData);
  }

  @Delete(':id')
  async deleteProcesso(@Param('id') processoId: number): Promise<void> {
    await this.processoService.deleteProcesso(processoId);
  }

}
