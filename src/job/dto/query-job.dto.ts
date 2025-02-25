import { ApiPropertyOptional } from '@nestjs/swagger';
import { BaseQueryDto } from '../../utils/dto/base-query.dto';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { JobStatus } from '../../database/schema/job.schema';

export class QueryJobDto extends BaseQueryDto {
  @ApiPropertyOptional({ example: 'olive-young' })
  @IsOptional()
  @IsString()
  platform?: string;

  @ApiPropertyOptional({})
  @IsOptional()
  @IsString()
  type?: string;

  @ApiPropertyOptional({})
  @IsOptional()
  @IsEnum(JobStatus)
  status?: string;
}
