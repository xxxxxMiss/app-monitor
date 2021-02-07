import { Test, TestingModule } from '@nestjs/testing';
import { JoinImgController } from './join-img.controller';

describe('JoinImgController', () => {
  let controller: JoinImgController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JoinImgController],
    }).compile();

    controller = module.get<JoinImgController>(JoinImgController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
