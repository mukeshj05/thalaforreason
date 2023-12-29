import { Controller, Get, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Dto, Validate } from '@libs/boat/validators';
import { AppDto } from './app.validatore';
import { Public } from '@libs/boat/decorators';
import { Response } from '@libs/boat';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Validate(AppDto)
  @Get()
  async checkThalaForReason(
    @Res() res: Response,
    @Dto() inputs: AppDto,
  ): Promise<Response> {
    return res.success(await this.appService.checkThalaForReason(inputs));
  }
}
