import { Injectable } from '@nestjs/common';
import { SwapResultDto } from './dto/swap-result.dto';
import { MoralisService } from '../moralis/moralis.service';

@Injectable()
export class SwapService {
  private readonly tokenAddresses = {
    'ETH': '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    'BTC': '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
  } as const;

  constructor(private moralisService: MoralisService) {}

  async calculateSwap(ethAmount: number): Promise<SwapResultDto> {
    const ethPrice = await this.getTokenPrice('ETH');
    const btcPrice = await this.getTokenPrice('BTC');
    
    const ethValue = ethAmount * ethPrice;
    const btcAmount = ethValue / btcPrice;
    
    const feePercentage = 0.03;
    const feeInEth = ethAmount * feePercentage;
    const feeInUsd = feeInEth * ethPrice;

    return {
      btcAmount,
      fee: {
        eth: feeInEth,
        usd: feeInUsd,
      },
    };
  }

  private async getTokenPrice(token: keyof typeof this.tokenAddresses): Promise<number> {
    return this.moralisService.getTokenPrice(this.tokenAddresses[token]);
  }
}