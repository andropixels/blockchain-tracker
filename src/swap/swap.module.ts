import { Module } from '@nestjs/common';
import { SwapService } from './swap.service';
import { SwapController } from './swap.controller';
import { MoralisModule } from '../moralis/moralis.module';

@Module({
  imports: [MoralisModule],
  controllers: [SwapController],
  providers: [SwapService],
})
export class SwapModule {}
