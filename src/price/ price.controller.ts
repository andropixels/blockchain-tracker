import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PriceService } from './ price.service';
import { Price } from './price.entity';

@ApiTags('prices')
@Controller('prices')
export class PriceController {
  constructor(private readonly priceService: PriceService) {}

  @Get(':chain/hourly')
  @ApiOperation({ summary: 'Get hourly prices for the last 24 hours' })
  @ApiResponse({ status: 200, description: 'Returns hourly prices', type: [Price] })
  async getHourlyPrices(@Param('chain') chain: string): Promise<Price[]> {
    return this.priceService.getHourlyPrices(chain);
  }
}