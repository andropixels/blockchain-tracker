import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SwapService } from './swap.service';
import { SwapResultDto } from './dto';

@ApiTags('swap')
@Controller('swap')
export class SwapController {
  constructor(private readonly swapService: SwapService) {}

  @Get('eth-to-btc')
  @ApiOperation({ summary: 'Calculate ETH to BTC swap' })
  @ApiResponse({
    status: 200,
    description: 'Returns BTC amount and fees',
    type: SwapResultDto,
  })
  async calculateSwap(@Query('ethAmount') ethAmount: number): Promise<SwapResultDto> {
    return this.swapService.calculateSwap(ethAmount);
  }
}