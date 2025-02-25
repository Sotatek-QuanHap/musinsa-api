import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { Platform } from '../../database/schema/job.schema';
import { JobType } from '../../config/constants';

export class CreateJobDto {
  @ApiProperty({
    example: 'olive-young',
    description: 'The platform of the job',
    type: String,
    enum: Platform,
  })
  @IsNotEmpty()
  platform: Platform;

  @ApiProperty({
    description: 'The type of the job',
    type: String,
    enum: JobType,
  })
  @IsNotEmpty()
  @IsEnum(JobType)
  type: JobType;

  @ApiProperty({
    example: ['url'],
    type: 'array',
    description: 'The categories of the job',
  })
  @IsArray()
  @IsOptional()
  categories: string[];
}
