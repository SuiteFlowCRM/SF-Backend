import { Controller, Post, Body, Get, Put, Param, Query, Delete } from '@nestjs/common';
import { EmpresasService } from './empresas.service';

@Controller('empresas')
export class EmpresasController {

  constructor(private readonly empresasService: EmpresasService) { }


  @Get('getEmpresa')
  async findEmpresa(
    @Query('empresa') empresa: string,
  ): Promise<any[]> {

    return this.empresasService.findEmpresa(empresa);
  }

}
