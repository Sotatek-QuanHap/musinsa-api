import { ApiTags } from '@nestjs/swagger';
import { Controller, Get, Param, Query } from '@nestjs/common';
import { ProductSqlService } from './product-sql.service';
import { QueryProductDto } from './dto/query-product';

@ApiTags('Product')
@Controller({
  path: 'product',
  version: '1',
})
export class ProductController {
  constructor(private readonly productSqlService: ProductSqlService) {}

  @Get()
  findAll(@Query() query: QueryProductDto) {
    return this.productSqlService.findAll(query);
  }

  @Get(':productId/platform/:platform')
  async findOne(
    @Param('productId') productId: string,
    @Param('platform') platform: string,
  ) {
    return this.productSqlService.findOne(productId, platform);
  }
}
