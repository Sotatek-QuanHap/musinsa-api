import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export enum Order {
  ASC = 'ASC',
  DESC = 'DESC',
}

export const OrderMap = {
  [Order.ASC]: 1,
  [Order.DESC]: -1,
};
export class BaseQueryDto {
  @ApiPropertyOptional()
  @Transform(({ value }) => (value ? Number(value) : 1))
  @IsNumber()
  @IsOptional()
  page: number = 1;

  @ApiPropertyOptional()
  @Transform(({ value }) => (value ? Number(value) : 10))
  @IsNumber()
  @IsOptional()
  limit: number = 10;

  @ApiPropertyOptional({
    enum: Order,
  })
  @IsEnum(Order)
  @IsOptional()
  orderBy?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  sortBy?: string;
}
