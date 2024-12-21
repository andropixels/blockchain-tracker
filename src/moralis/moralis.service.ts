import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Moralis from 'moralis';

@Injectable()
export class MoralisService implements OnModuleInit {
  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    if (!Moralis.Core.isStarted) {
      await Moralis.start({
        apiKey: this.configService.get<string>('moralis.apiKey'),
      });
    }
  }

  async getTokenPrice(address: string): Promise<number> {
    const response = await Moralis.EvmApi.token.getTokenPrice({
      address,
      chain: '0x1', // Ethereum mainnet
    });
    return response.raw.usdPrice;
  }
}