import { Module } from '@nestjs/common';
import {FilterController } from './filters.controller';
import { FiltersService } from './filters.service';

@Module({
  controllers: [FilterController],
  providers: [FiltersService], 
})

export class FilterModule {}
