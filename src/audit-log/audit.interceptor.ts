import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { AuditLogService } from '../audit-log/audit-log.service';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private readonly auditLogService: AuditLogService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    const user = request.user?.name || 'Anonymous';
    const method = request.method;
    const url = request.originalUrl || request.url;
    const ip = request.ip;
    const userAgent = request.headers['user-agent'];

    return next.handle().pipe(
      tap(() => {
        if (!url.includes('health') && !url.includes('favicon')) {
          this.auditLogService.log({
            user,
            action: `${method} ${url}`,
            resource: url.split('/')[1] || 'unknown',
            metadata: { ip, userAgent },
          });
        }
      })
    );
  }
}
