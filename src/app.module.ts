import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BoatModule } from '@libs/boat';
import { Input } from './app.model';

@Module({
  imports: [BoatModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: 'INPUT_REPOSITORY',
      useValue: Input,
    },
  ],
})
export class AppModule {}
