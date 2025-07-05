import { Module, Scope } from '@nestjs/common';
import { LoginService } from './login.service';
import { LoginController } from './login.controller';
import { AccessControlService } from 'src/utils/access-control.service';

@Module({
  controllers: [LoginController],
  providers: [LoginService, {
      provide: AccessControlService,
      useClass: AccessControlService,
      scope: Scope.REQUEST, 
    }],
})
export class LoginModule {}
