import { Test, TestingModule } from '@nestjs/testing';
import { GithubDataFetchingService } from './github-data-fetching.service';

describe('GithubDataFetchingService', () => {
  let service: GithubDataFetchingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GithubDataFetchingService],
    }).compile();

    service = module.get<GithubDataFetchingService>(GithubDataFetchingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
