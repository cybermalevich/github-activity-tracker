import { Test, TestingModule } from '@nestjs/testing';
import { RepEventsService } from './rep-events.service';

describe('RepEventsService', () => {
  let service: RepEventsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RepEventsService],
    }).compile();

    service = module.get<RepEventsService>(RepEventsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
