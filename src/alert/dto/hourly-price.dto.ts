import { ApiProperty } from '@nestjs/swagger';

export class HourlyPriceDto {
  @ApiProperty({
    description: 'The timestamp of the price record',
    example: '2024-12-21T10:00:00Z',
  })
  timestamp: Date;

  @ApiProperty({
    description: 'The price in USD',
    example: 1850.75,
  })
  price: number;
}