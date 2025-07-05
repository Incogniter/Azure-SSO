import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoginModule } from './login/login.module';
import { AuditLogModule } from './audit-log/audit-log.module';
@Module({
  imports: [LoginModule, AuditLogModule],
  controllers: [AppController],
  providers: [AppService,
  ],
})
export class AppModule {}
