import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Alert } from './alert.entity';
import { CreateAlertDto } from './dto/create-alert.dto';
import { EmailService } from '../email/email.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AlertService {
  private readonly logger = new Logger(AlertService.name);

  constructor(
    @InjectRepository(Alert)
    private alertRepository: Repository<Alert>,
    private configService: ConfigService,
  ) {}

  async createAlert(createAlertDto: CreateAlertDto): Promise<Alert> {
    const alert = this.alertRepository.create(createAlertDto);
    return this.alertRepository.save(alert);
  }

  async checkPriceAlerts(chain: string, currentPrice: number): Promise<void> {
    const alerts = await this.alertRepository.find({
      where: {
        chain,
        triggered: false,
      },
    });

    for (const alert of alerts) {
      if (
        (alert.targetPrice >= currentPrice && !alert.triggered) ||
        (alert.targetPrice <= currentPrice && !alert.triggered)
      ) {
        await this.triggerAlert(alert, currentPrice);
      }
    }
  }

  private async triggerAlert(alert: Alert, currentPrice: number): Promise<void> {
    const emailService = new EmailService(this.configService);
    
    await emailService.sendEmail(
      alert.email,
      `Price Alert for ${alert.chain.toUpperCase()}`,
      `The price of ${alert.chain} has reached your target price of $${alert.targetPrice}.\n` +
      `Current price: $${currentPrice}`,
    );

    alert.triggered = true;
    await this.alertRepository.save(alert);
  }
}