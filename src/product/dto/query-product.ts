import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';
import { BaseQueryDto } from '../../utils/dto/base-query.dto';
import { IsCategoriesAllowed } from '../../utils/decorators/Is-categories-allowed.decorator';

enum MappedStatus {
  'UnMapped' = 'UnMapped',
  'Mapped' = 'Mapped',
}

enum SortByProduct {
  'normalPrice' = 'normalPrice',
  'finalPrice' = 'finalPrice',
  'saleRate' = 'saleRate',
  'updatedAt' = 'updatedAt',
}

export class QueryProductDto extends BaseQueryDto {
  @ApiPropertyOptional({ enum: SortByProduct })
  @IsEnum(SortByProduct)
  @IsOptional()
  sortBy?: SortByProduct;

  @ApiPropertyOptional({ example: 'olive-young' })
  @IsString()
  @IsOptional()
  platform?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsNumberString()
  @IsOptional()
  normalPriceFrom?: number;

  @ApiPropertyOptional({ example: 1 })
  @IsNumberString()
  @IsOptional()
  normalPriceTo?: number;

  @ApiPropertyOptional({ example: 1 })
  @IsNumberString()
  @IsOptional()
  finalPriceFrom?: number;

  @ApiPropertyOptional({ example: 1 })
  @IsNumberString()
  @IsOptional()
  finalPriceTo?: number;

  @ApiPropertyOptional({ example: 10 })
  @IsNumberString()
  @IsOptional()
  saleRateFrom?: number;

  @ApiPropertyOptional({ example: 100 })
  @IsNumberString()
  @IsOptional()
  saleRateTo?: number;

  @ApiPropertyOptional({ enum: MappedStatus })
  @IsString()
  @IsOptional()
  mappedStatus?: MappedStatus;

  @ApiPropertyOptional({ example: 1 })
  @IsNumberString()
  @IsOptional()
  CPIFrom?: number;

  @ApiPropertyOptional({ example: 1 })
  @IsNumberString()
  @IsOptional()
  CPITo?: number;

  @ApiPropertyOptional({ example: '2025-02-17' })
  @IsDateString()
  @IsOptional()
  updatedAtFrom?: Date;

  @ApiPropertyOptional({ example: '2025-02-17' })
  @IsDateString()
  @IsOptional()
  updatedAtTo?: Date;

  @ApiPropertyOptional({ example: '818,686' })
  @IsOptional()
  @IsString()
  @IsCategoriesAllowed()
  categories?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  search?: string;
}
