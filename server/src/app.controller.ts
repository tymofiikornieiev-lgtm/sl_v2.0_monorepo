import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { AllowAnonymous } from './auth/decorators/allow-anonymous.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @AllowAnonymous()
  @Get('test')
  getTest(): string {
    console.log('ENV', process.env.NODE_ENV);
    return this.appService.getTest();
  }
}
