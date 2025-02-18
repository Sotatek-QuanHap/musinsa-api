import { Module } from '@nestjs/common';
import { PLPResultModule } from './plp-result/plp-result.module';

@Module({
  imports: [PLPResultModule],
  providers: [],
  exports: [PLPResultModule],
})
export class AblyModule {}
