import { LocationInterceptor } from './location.interceptor';
import { Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';

describe('LocationInterceptor', () => {
  let interceptor: LocationInterceptor;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [Reflector],
    }).compile();

    const reflector = module.get<Reflector>(Reflector);
    interceptor = new LocationInterceptor(reflector);
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });
});
