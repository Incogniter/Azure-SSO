import { Test, TestingModule } from '@nestjs/testing';
import { AzureSyncController } from './azure-sync.controller';
import { AzureSyncService } from './azure-sync.service';

describe('AzureSyncController', () => {
  let controller: AzureSyncController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AzureSyncController],
      providers: [AzureSyncService],
    }).compile();

    controller = module.get<AzureSyncController>(AzureSyncController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
