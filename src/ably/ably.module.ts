import { Module } from '@nestjs/common';
import { PDPResultModule } from './pdp-result/pdp-result.module';

@Module({
  imports: [PDPResultModule],
  providers: [],
  exports: [],
})
export class AblyModule {}
