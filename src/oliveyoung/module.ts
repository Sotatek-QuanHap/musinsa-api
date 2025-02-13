import { Module } from '@nestjs/common';
import { CategoryResultModule } from './category-result/category-result.module';
import { PDPResultModule } from './pdp-result/pdp-result.module';

@Module({
  imports: [CategoryResultModule, PDPResultModule],
  providers: [],
  exports: [CategoryResultModule, PDPResultModule],
})
export class OliveYoungModule {}
