import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationDto {

  @ApiProperty({ description: 'Number of items per page', example: 10, required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  readonly limit: number = 10;

  @ApiProperty({ description: 'Page number', example: 1, required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  readonly page: number = 1;
}


