import { Module } from '@nestjs/common';
import { PDPResultModule } from './pdp-result/pdp-result.module';
import { CategoryResultModule } from './category-result/category-result.module';
import { PLPResultModule } from './plp-result/plp-result.module';

@Module({
  imports: [PDPResultModule, PLPResultModule, CategoryResultModule],
  providers: [],
  exports: [],
})
export class AblyModule {}
