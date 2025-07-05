import { Injectable } from '@nestjs/common';

export interface AuditEntry {
  timestamp: Date;
  user: string;
  action: string;
  resource: string;
  metadata?: Record<string, any>;
}

@Injectable()
export class AuditLogService {
  private logs: AuditEntry[] = [];

  log(entry: Omit<AuditEntry, 'timestamp'>) {
    const fullEntry: AuditEntry = {
      ...entry,
      timestamp: new Date(),
    };
    this.logs.push(fullEntry);
  }

  getAllLogs(): AuditEntry[] {
    return this.logs;
  }

  clearLogs() {
    this.logs = [];
  }
}
