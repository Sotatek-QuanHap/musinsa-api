import { Module } from '@nestjs/common';
import { CategoryResultModule } from './category-result/category-result.module';
import { PDPResultModule } from './pdp-result/pdp-result.module';
import { PLPResultModule } from './plp-result/plp-result.module';

@Module({
  imports: [CategoryResultModule, PLPResultModule, PDPResultModule],
  providers: [],
  exports: [CategoryResultModule, PLPResultModule, PDPResultModule],
})
export class OliveYoungModule {}
