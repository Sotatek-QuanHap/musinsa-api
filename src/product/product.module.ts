import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductSqlService } from './product-sql.service';

@Module({
  imports: [],
  controllers: [ProductController],
  providers: [ProductSqlService],
})
export class ProductModule {}
