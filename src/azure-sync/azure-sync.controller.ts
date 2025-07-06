import { Controller, Post, Headers, HttpException, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { AzureSyncService } from './azure-sync.service';

@Controller('azure-sync')
export class AzureSyncController {
  constructor(private readonly azureSyncService: AzureSyncService) {}

@Post('trigger')
async triggerSync(@Headers() headers: any) {
  const authHeader = headers.authorization;  
  const accessToken = authHeader?.replace(/^Bearer /, '');

  if (!accessToken) {
    throw new UnauthorizedException('Missing access token');
  }

  await this.azureSyncService.syncUsersAndRoles(accessToken);
  return { message: 'Azure sync started' };
}
}
