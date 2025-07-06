import { Module } from '@nestjs/common';
import { AzureSyncService } from './azure-sync.service';
import { AzureSyncController } from './azure-sync.controller';

@Module({
  controllers: [AzureSyncController],
  providers: [AzureSyncService],
})
export class AzureSyncModule {}
