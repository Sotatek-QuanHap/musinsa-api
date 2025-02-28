import { ApiTags } from '@nestjs/swagger';
import { Controller, Get, Post, Query } from '@nestjs/common';
import { CategorySqlService } from './category-sql.service';
import { QueryCategoryDto } from './dto/query-category';
import { SqlSynchronizationService } from '../sql-synchronization/sql-synchronization.service';

@ApiTags('Category')
@Controller({
  path: 'category',
  version: '1',
})
export class CategoryController {
  constructor(
    private readonly categorySqlService: CategorySqlService,
    private sqlSynchronizationService: SqlSynchronizationService,
  ) {}

  @Get()
  findAll(@Query() query: QueryCategoryDto) {
    return this.categorySqlService.findAll(query);
  }

  @Post('sync-category')
  syncCategory() {
    return this.sqlSynchronizationService.syncCategories();
  }

  @Post('sync-product')
  syncProduct() {
    return this.sqlSynchronizationService.syncProducts();
  }

  @Post('sync-product-history')
  syncProductHistory() {
    return this.sqlSynchronizationService.syncProductHistories();
  }
}
