import { Test, TestingModule } from '@nestjs/testing';
import { AzureSyncService } from './azure-sync.service';

describe('AzureSyncService', () => {
  let service: AzureSyncService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AzureSyncService],
    }).compile();

    service = module.get<AzureSyncService>(AzureSyncService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
