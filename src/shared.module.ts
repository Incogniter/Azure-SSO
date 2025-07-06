import { Module, Scope } from '@nestjs/common';
import { AccessControlService } from './utils/access-control.service';

@Module({
  providers: [
    {
      provide: AccessControlService,
      useClass: AccessControlService,
      scope: Scope.REQUEST,
    },
  ],
  exports: [AccessControlService],
})
export class SharedModule {}
