import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JWTAuth {
  constructor(private jwtService: JwtService) {}

  async signJWT(payload: any): Promise<string> {
    try {
      const accessToken = await this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET,
      });

      return accessToken;
    } catch (err) {
      return null;
    }
  }

  async verifyJWT(token: string): Promise<Record<string, any>> {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });

      return payload;
    } catch (err) {
      return null;
    }
  }
}
