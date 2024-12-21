import { ApiProperty } from '@nestjs/swagger';

export class SwapFeeDto {
  @ApiProperty({
    description: 'Fee amount in ETH',
    example: 0.03,
  })
  eth: number;

  @ApiProperty({
    description: 'Fee amount in USD',
    example: 45.50,
  })
  usd: number;
}

export class SwapResultDto {
  @ApiProperty({
    description: 'Amount of BTC to receive',
    example: 0.05,
  })
  btcAmount: number;

  @ApiProperty({
    description: 'Swap fees',
    type: SwapFeeDto,
  })
  fee: SwapFeeDto;
}