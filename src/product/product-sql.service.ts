import { Injectable } from '@nestjs/common';
import { QueryProductDto } from './dto/query-product';
import { Brackets } from 'typeorm';
import { Product } from '../sql/entities/product.entity';
import { QueryUtil } from '../utils/query.util';

@Injectable()
export class ProductSqlService {
  constructor() {}

  async findAll(query: QueryProductDto) {
    const { page, limit } = query;
    const selectFields = [
      'productId',
      'platform',
      'productName',
      'url',
      'categoryId',
      'categoryName',
      'brandName',
      'normalPrice',
      'finalPrice',
      'saleRate',
      'mappedStatus',
      'updatedAt',
      'image',
      'extraCategory',
    ].map((field) => `product.${field}`);

    const queryBuilder = Product.createQueryBuilder('product')
      .select(selectFields)
      .offset((page - 1) * limit)
      .limit(limit);
    if (query.platform) {
      queryBuilder.andWhere('product.platform = :platform', {
        platform: query.platform,
      });
    }
    if (query.mappedStatus) {
      queryBuilder.andWhere('product.mappedStatus = :mappedStatus', {
        mappedStatus: query.mappedStatus,
      });
    }
    QueryUtil.convertQueryFilterRange(
      'product',
      ['normalPrice', 'finalPrice', 'saleRate', 'updatedAt'],
      queryBuilder,
      query,
    );
    if (query.categories) {
      const categories = query.categories.split(',');
      queryBuilder.andWhere('product.categoryId IN(:...categories)', {
        categories,
      });
    }
    if (query.search) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          ['productName', 'brandName', 'productId', 'url'].forEach((field) => {
            qb.orWhere(`product.${field} LIKE :search`, {
              search: `%${query.search}%`,
            });
          });
        }),
      );
    }
    if (query.sortBy && query.orderBy) {
      const orderBy: any = query.orderBy;
      queryBuilder.orderBy(`product.${query.sortBy}`, orderBy);
    }
    const [products, count] = await Promise.all([
      queryBuilder.getMany(),
      queryBuilder.getCount(),
    ]);
    return {
      items: products,
      meta: {
        count,
        size: limit,
        page,
        totalPages: limit > 0 ? Math.ceil(count / limit) : 1,
      },
    };
  }

  findOne(productId: string, platform: string) {
    return Product.findOne({ where: { productId, platform } });
  }
}
