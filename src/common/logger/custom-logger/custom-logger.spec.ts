import { Test, TestingModule } from '@nestjs/testing';
import { CustomLogger } from './custom-logger';

describe('CustomLogger', () => {
  let provider: CustomLogger;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CustomLogger],
    }).compile();

    provider = module.get<CustomLogger>(CustomLogger);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
