import { Test, TestingModule } from '@nestjs/testing';
import { AddVipController } from './add-vip.controller';

describe('AddVipController', () => {
  let controller: AddVipController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AddVipController],
    }).compile();

    controller = module.get<AddVipController>(AddVipController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
