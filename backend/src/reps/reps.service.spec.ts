import { Test, TestingModule } from '@nestjs/testing';
import { RepsService } from './reps.service';

describe('RepsService', () => {
  let service: RepsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RepsService],
    }).compile();

    service = module.get<RepsService>(RepsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
