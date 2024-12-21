import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual, LessThanOrEqual } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import Moralis from 'moralis';
import { Price } from './price.entity';
import { ConfigService } from '@nestjs/config';
import { AlertService } from '../alert/alert.service';
import { EmailService } from '../email/email.service';
import { MoralisService } from '../moralis/moralis.service';

@Injectable()
export class PriceService {
    private readonly logger = new Logger(PriceService.name);
    private readonly emailService: EmailService;
  
    private readonly tokenAddresses = {
      'ETH': '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
      'MATIC': '0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0',
    } as const;

    
    constructor(
        @InjectRepository(Price)
        private priceRepository: Repository<Price>,
        private configService: ConfigService,
        private alertService: AlertService,
        private moralisService: MoralisService,
      ) {
        this.emailService = new EmailService(configService);
      }



 @Cron(CronExpression.EVERY_5_MINUTES)
  async trackPrices() {
    try {
      // Get ETH price
      const ethPrice = await this.getTokenPrice('ETH');
      await this.savePrice('ethereum', ethPrice);

      // Get MATIC (Polygon) price
      const maticPrice = await this.getTokenPrice('MATIC');
      await this.savePrice('polygon', maticPrice);

      // Check for price alerts
      await this.checkPriceChanges();
    } catch (error) {
      this.logger.error('Error tracking prices:', error);
    }
  }


 private async getTokenPrice(token: keyof typeof this.tokenAddresses): Promise<number> {
    return this.moralisService.getTokenPrice(this.tokenAddresses[token]);
  }
  

  private async savePrice(chain: string, price: number) {
    const priceEntity = this.priceRepository.create({
      chain,
      price,
    });
    await this.priceRepository.save(priceEntity);
  }

  private async checkPriceChanges() {
    const chains = ['ethereum', 'polygon'];
    const oneHourAgo = new Date(Date.now() - 3600000);

    for (const chain of chains) {
      const [currentPrice, oldPrice] = await Promise.all([
        this.priceRepository.findOne({
          where: { chain },
          order: { timestamp: 'DESC' },
        }),
        this.priceRepository.findOne({
          where: {
            chain,
            timestamp: LessThanOrEqual(oneHourAgo),
          },
          order: { timestamp: 'DESC' },
        }),
      ]);

      if (currentPrice && oldPrice) {
        const priceChange = ((currentPrice.price - oldPrice.price) / oldPrice.price) * 100;
        if (priceChange > 3) {
          await this.sendPriceAlert(chain, priceChange, currentPrice.price, oldPrice.price);
        }
      }
    }
  }

  private async sendPriceAlert(
    chain: string,
    priceChange: number,
    currentPrice: number,
    oldPrice: number,
  ) {
    await this.emailService.sendEmail(
      'hyperhire_assignment@hyperhire.in',
      `${chain.toUpperCase()} Price Alert`,
      `The price of ${chain} has increased by ${priceChange.toFixed(2)}% in the last hour.\n` +
      `Current price: $${currentPrice}\n` +
      `Price one hour ago: $${oldPrice}`,
    );
  }

  async getHourlyPrices(chain: string): Promise<Price[]> {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return this.priceRepository.find({
      where: {
        chain,
        timestamp: MoreThanOrEqual(twentyFourHoursAgo),
      },
      order: { timestamp: 'DESC' },
    });
  }
}
