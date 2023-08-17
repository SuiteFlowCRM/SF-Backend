import { Module } from '@nestjs/common';
import { UserController } from './participantes.controller';
import { ParticipanteService } from './participantes.service';

@Module({
  controllers: [UserController],
  providers: [ParticipanteService], 
})

export class PrticipanteModule {}
