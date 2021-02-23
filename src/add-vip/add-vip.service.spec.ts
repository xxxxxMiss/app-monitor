import { Test, TestingModule } from '@nestjs/testing';
import { AddVipService } from './add-vip.service';

describe('AddVipService', () => {
  let service: AddVipService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AddVipService],
    }).compile();

    service = module.get<AddVipService>(AddVipService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
