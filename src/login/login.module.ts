import { Module } from '@nestjs/common';
import { LoginService } from './login.service';
import { LoginController } from './login.controller';
import { AuditLogModule } from 'src/audit-log/audit-log.module';
import { SharedModule } from 'src/shared.module';

@Module({
  imports: [AuditLogModule,SharedModule], 
  controllers: [LoginController],
  providers: [LoginService],
})
export class LoginModule {}
