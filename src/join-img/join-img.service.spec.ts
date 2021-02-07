import { Test, TestingModule } from '@nestjs/testing';
import { JoinImgService } from './join-img.service';

describe('JoinImgService', () => {
  let service: JoinImgService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JoinImgService],
    }).compile();

    service = module.get<JoinImgService>(JoinImgService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
