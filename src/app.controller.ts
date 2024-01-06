import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Dto, Validate } from '@libs/boat/validators';
import { AppDto } from './app.validatore';
import { Public } from '@libs/boat/decorators';
import { ResponseSerializer, Serializer } from '@libs/boat';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Validate(AppDto)
  @Get()
  async checkThalaForReason(
    @Dto() inputs: AppDto,
    @Serializer() serializer: ResponseSerializer,
  ) {
    const data = await this.appService.checkThalaForReason(inputs);
    console.log(serializer);
    return serializer.success(data);
  }
}
