import { AppModule } from './app.module';
import { Server } from '@libs/boat';

Server.create(AppModule, {
  port: +process.env.PORT,
});
