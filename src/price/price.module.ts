import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PriceService } from './ price.service';
import { PriceController } from './ price.controller';
import { Price } from './price.entity';
import { AlertModule } from '../alert/alert.module';
import { MoralisModule } from '../moralis/moralis.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Price]),
    AlertModule,
    MoralisModule,
  ],
  controllers: [PriceController],
  providers: [PriceService],
  exports: [PriceService],
})
export class PriceModule {}