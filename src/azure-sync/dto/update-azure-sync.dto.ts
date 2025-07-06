import { PartialType } from '@nestjs/mapped-types';
import { CreateAzureSyncDto } from './create-azure-sync.dto';

export class UpdateAzureSyncDto extends PartialType(CreateAzureSyncDto) {}
