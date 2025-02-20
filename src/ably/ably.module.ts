import { Module } from '@nestjs/common';
import { PDPResultModule } from './pdp-result/pdp-result.module';
import { CategoryResultModule } from './category-result/category-result.module';

@Module({
  imports: [PDPResultModule, CategoryResultModule],
  providers: [],
  exports: [],
})
export class AblyModule {}
