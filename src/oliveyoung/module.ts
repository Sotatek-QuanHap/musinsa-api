import { Module } from '@nestjs/common';
import { CategoryResultModule } from './category-result/category-result.module';

@Module({
  imports: [CategoryResultModule],
  providers: [],
  exports: [CategoryResultModule],
})
export class OliveYoungModule {}
