import { Module } from '@nestjs/common';
import { ProcessoController } from './processo.controller';
import { ProcessoService } from './processo.service';

@Module({
  controllers: [ProcessoController],
  providers: [ProcessoService], 
})

export class ProcessoModule {}
