import { Global, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { BoatService } from './services';
import config from '@config/index';
import { JwtGuard } from './guards/jwtGuard';
import { UserRoleGuard } from './guards/userRoleGuard';
import { Hashing, JWTAuth } from './tasks';
import { SequelizeModule } from '@nestjs/sequelize';
import { DatabaseModel } from './database/basemodel';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      load: config,
      cache: true,
    }),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        ...new DatabaseModel(config).sequelize.options,
      }),
      inject: [ConfigService],
    }),
    JwtModule.register({
      global: true,
    }),
  ],
  providers: [
    BoatService,
    Hashing,
    JWTAuth,
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
    {
      provide: APP_GUARD,
      useClass: UserRoleGuard,
    },
  ],
  exports: [BoatService],
})
export class BoatModule {}
