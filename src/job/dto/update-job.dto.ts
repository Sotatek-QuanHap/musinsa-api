import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateJobDto } from './create-job.dto';

export class UpdateJobDto extends PartialType(CreateJobDto) {
  @ApiProperty({
    example: {},
    description: 'The payload of the job',
    type: Object,
  })
  payload: object;

  @ApiProperty({
    example: {},
    description: 'The summary of the job',
    type: Object,
  })
  summary: object;
}
