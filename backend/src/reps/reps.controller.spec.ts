import { Test, TestingModule } from '@nestjs/testing';
import { RepsController } from './reps.controller';

describe('RepsController', () => {
  let controller: RepsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RepsController],
    }).compile();

    controller = module.get<RepsController>(RepsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
