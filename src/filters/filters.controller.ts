import { Controller, Post, Body, Get, Put, Param, Query, Delete } from '@nestjs/common';
import { FiltersService } from './filters.service';

@Controller('filters')
export class FilterController {

  constructor(private readonly filterService: FiltersService) { }

  @Post()
  async createOrUpdateFilter(@Body() filterData: any): Promise<any> {
    return this.filterService.createOrUpdateFilter(filterData);
  }

  @Get('getFilters')
  async findAllFiltered(
    @Query('id_user') id_user: string,
  ): Promise<any[]> {

    return this.filterService.findAllFiltered(id_user);
  }

  @Delete(':userId/:filterNumber')
  async deleteFilter(
    @Param('userId') userId: number,
    @Param('filterNumber') filterNumber: string
  ): Promise<void> {
    await this.filterService.deleteFilter(userId, filterNumber);
  }

}
