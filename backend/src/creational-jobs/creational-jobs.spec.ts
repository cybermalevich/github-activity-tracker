import { Test, TestingModule } from '@nestjs/testing';
import { CreationalJobsService } from './creational-jobs.service';

describe('GithubAuthService', () => {
  let service: CreationalJobsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CreationalJobsService],
    }).compile();

    service = module.get<CreationalJobsService>(CreationalJobsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
