import { Test, TestingModule } from '@nestjs/testing';
import { CreationalJobsController } from './creational-jobs.controller';

describe('GithubAuthController', () => {
  let controller: CreationalJobsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CreationalJobsController],
    }).compile();

    controller = module.get<CreationalJobsController>(CreationalJobsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
