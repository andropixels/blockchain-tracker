import { Controller, Post } from '@nestjs/common';
import { EmailService } from './email.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('email')
@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('test')
  @ApiOperation({ summary: 'Test email service' })
  async testEmail() {
    const result = await this.emailService.testEmailService();
    return { success: result };
  }
}