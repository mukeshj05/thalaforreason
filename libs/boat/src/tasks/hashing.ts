import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class Hashing {
  constructor(private readonly config: ConfigService) {}

  async createHash(data: string): Promise<string> {
    const result = this.config.get('services');
    const hash = await bcrypt.hash(data, result.hashSalt);

    return hash;
  }

  async compareHash(data: string, hash: string): Promise<boolean> {
    const isMatch = await bcrypt.compare(data, hash);

    return isMatch;
  }
}
