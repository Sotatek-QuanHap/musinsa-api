import { Module } from '@nestjs/common';
import { PLPResultModule } from './plp-result/plp-result.module';

@Module({
  imports: [PLPResultModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class OliveyoungModule {}
