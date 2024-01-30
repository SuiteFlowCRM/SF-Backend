import { Test, TestingModule } from '@nestjs/testing';
import { ProcessoController } from './processo.controller';

describe('CardsController', () => {
  let controller: ProcessoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProcessoController],
    }).compile();

    controller = module.get<ProcessoController>(ProcessoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
