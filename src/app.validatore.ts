import { IsStringNumberCombination } from '@libs/boat/validators/customValidators';
import { IsString } from 'class-validator';

export class AppDto {
  @IsStringNumberCombination()
  @IsString()
  input: string;
}
