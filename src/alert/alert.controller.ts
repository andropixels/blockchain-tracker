import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AlertService } from './alert.service';
import { CreateAlertDto } from './dto/create-alert.dto';
import { Alert } from './alert.entity';

@ApiTags('alerts')
@Controller('alerts')
export class AlertController {
  constructor(private readonly alertService: AlertService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new price alert' })
  @ApiResponse({ status: 201, description: 'Alert created successfully', type: Alert })
  async createAlert(@Body() createAlertDto: CreateAlertDto): Promise<Alert> {
    return this.alertService.createAlert(createAlertDto);
  }
}