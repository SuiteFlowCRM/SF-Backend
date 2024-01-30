import { Controller, Post, Body, Get, Put, Param, Query, Delete } from '@nestjs/common';
import { ParticipanteService } from './participantes.service';

@Controller('participantes')
export class UserController {

  constructor(private readonly participanteService: ParticipanteService) { }

  @Post()
  async createParticipante(@Body() userData: any): Promise<any> {
    return this.participanteService.createParticipante(userData);
  }

  @Put(':id')
  async updateParticipante(
    @Param('id') userId: number,
    @Body() updatedUserData: any,
  ): Promise<any> {
    return this.participanteService.updateParticipante(userId, updatedUserData);
  }

  // @Get('getParticipantes')
  // async findAllFiltered(
  //   @Query('id_user') id_user: string,
  // ): Promise<any[]> {

  //   return this.participanteService.findAllFiltered(id_user);
  // }

  @Get('getParticipantes')
async findAllFiltered(
  @Query('id_user') id_user: string,
  @Query('tipo_participante') tipoParticipante: string,
): Promise<any[]> {
  return this.participanteService.findAllFiltered(id_user, tipoParticipante);
}


  @Delete(':id')
  async deleteProduct(@Param('id') participanteId: number): Promise<void> {
    await this.participanteService.deleteParticipante(participanteId);
  }

}
