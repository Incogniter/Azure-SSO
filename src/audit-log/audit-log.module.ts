import { Module } from '@nestjs/common';
import { AuditLogService } from './audit-log.service';
import { AuditLogController } from './audit-log.controller';
import { AuditInterceptor } from './audit.interceptor';

@Module({
  controllers: [AuditLogController],
  providers: [AuditLogService,AuditInterceptor],
  exports: [AuditLogService,AuditInterceptor],
})
export class AuditLogModule {}
