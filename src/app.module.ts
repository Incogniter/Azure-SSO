import { Module, Scope } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoginModule } from './login/login.module';
import { AuditLogModule } from './audit-log/audit-log.module';
import { SharedModule } from './shared.module';
import { AzureSyncModule } from './azure-sync/azure-sync.module';
@Module({
  imports: [LoginModule, AuditLogModule, SharedModule, AzureSyncModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
