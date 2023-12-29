import { Injectable } from '@nestjs/common';
import { Hashing, JWTAuth } from '../tasks';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class BoatService {
  constructor(
    private hasing: Hashing,
    private jwtAuth: JWTAuth,
    private sequelize: Sequelize,
  ) {}
}
