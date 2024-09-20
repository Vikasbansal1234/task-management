// packages/common-modules/src/modules/shared.module.ts
import { Module } from '@nestjs/common';
import { SharedService } from './shared.service';

@Module({
  providers: [SharedService],
  exports: [SharedService], // Make sure to export the service so it's accessible in other modules
})
export class SharedModule {}
