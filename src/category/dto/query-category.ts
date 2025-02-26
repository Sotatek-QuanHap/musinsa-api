import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class QueryCategoryDto {
  @ApiPropertyOptional({ example: 'olive-young' })
  @IsOptional()
  @IsString()
  platform?: string;
}
