import { Module } from '@nestjs/common';
import { CategoryResultModule } from './category-result/category-result.module';
import { PLPResultModule } from './plp-result/plp-result.module';

@Module({
  imports: [CategoryResultModule, PLPResultModule],
  providers: [],
  exports: [CategoryResultModule],
})
export class OliveYoungModule {}
