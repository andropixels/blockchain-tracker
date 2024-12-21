import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    const host = this.configService.get('email.host');
    const port = this.configService.get('email.port');
    const user = this.configService.get('email.user');
    
    this.logger.log(`Initializing email service with host: ${host}, port: ${port}, user: ${user}`);
    
    this.transporter = nodemailer.createTransport({
      host: host,
      port: port,
      secure: false,
      auth: {
        user: user,
        pass: this.configService.get('email.password'),
      },
    });

    // Verify connection configuration
    this.verifyConnection();
  }

  private async verifyConnection() {
    try {
      await this.transporter.verify();
      this.logger.log('Email service connection verified successfully');
    } catch (error) {
      this.logger.error('Email service connection failed:', error);
    }
  }

  async sendEmail(to: string, subject: string, text: string): Promise<void> {
    this.logger.log(`Attempting to send email to ${to} with subject: ${subject}`);
    
    try {
      const from = this.configService.get('email.user');
      await this.transporter.sendMail({
        from,
        to,
        subject,
        text,
      });
      this.logger.log(`Email sent successfully to ${to}`);
    } catch (error) {
      this.logger.error(`Failed to send email to ${to}:`, error);
      throw error;
    }
  }

  // Test method to verify email configuration
  async testEmailService(): Promise<boolean> {
    try {
      await this.sendEmail(
        'hyperhire_assignment@hyperhire.in',
        'Blockchain Price Tracker - Test Email',
        'This is a test email to verify the email service is working correctly.'
      );
      return true;
    } catch (error) {
      this.logger.error('Test email failed:', error);
      return false;
    }
  }
}