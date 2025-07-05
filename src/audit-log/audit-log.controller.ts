import { Controller, Get, Delete } from '@nestjs/common';
import { AuditLogService } from './audit-log.service';

@Controller('audit-log')
export class AuditLogController {
  constructor(private readonly auditLogService: AuditLogService) {}

  @Get('logs')
  getAllLogs() {
    return this.auditLogService.getAllLogs();
  }

  @Delete('logs')
  clearAllLogs() {
    this.auditLogService.clearLogs();
    return { message: 'All logs cleared' };
  }
}
