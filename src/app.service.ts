import { Inject, Injectable } from '@nestjs/common';
import { AppDto } from './app.validatore';
import { Input } from './app.model';
import { IInputModel } from './interface';
import { startCase } from 'lodash';

@Injectable()
export class AppService {
  constructor(
    @Inject('INPUT_REPOSITORY')
    private userInputs: typeof Input,
  ) {}

  async checkThalaForReason(
    inputs: AppDto,
  ): Promise<{ status: boolean; message: string }> {
    const userInput: IInputModel = await this.userInputs.findOne({
      where: {
        input: inputs.input.toLowerCase(),
      },
    });

    if (userInput) {
      return {
        status: userInput.status,
        message: userInput.message,
      };
    }

    let message;

    const formattedInput = startCase(inputs.input);

    if (this.isNumberTotal(inputs.input)) {
      message = `Hurray! ${formattedInput} is thala for reason. Because total of ${inputs.input
        .split('')
        .join('+')} is 7.`;
    }
    if (this.isDivideBy7(inputs.input)) {
      message = `Hurray! ${formattedInput} is thala for reason. Because ${formattedInput} is divisible by 7.`;
    }
    if (this.isEqualTo(inputs.input)) {
      message = `Hurray! ${formattedInput} is thala for reason. Because ${formattedInput} belongs to thala.`;
    }
    if (this.isWordCountTotal7(inputs.input)) {
      message = `Hurray! ${formattedInput} is thala for reason. Because total of word count of ${formattedInput} is 7.`;
    }
    if (this.isWordCountDivideBy7(inputs.input)) {
      message = `Hurray! ${formattedInput} is thala for reason. Because word count of ${formattedInput} is divisible by 7.`;
    }
    if (this.isWordPositionIsTotal7(inputs.input)) {
      message = `Hurray! ${formattedInput} is thala for reason. Because total of positions of ${formattedInput} is 7.`;
    }
    if (this.isWordPositionIsDivideBy7(inputs.input)) {
      message = `Hurray! ${formattedInput} is thala for reason. Because positions of ${formattedInput} is divisible by 7.`;
    }

    const newInput: IInputModel = await this.userInputs.create({
      input: inputs.input.toLowerCase(),
      status: message ? true : false,
      message: message || `Oops! ${formattedInput} is not thala for reason.`,
    });

    return {
      status: newInput.status,
      message: newInput.message,
    };
  }

  isNumberTotal(input: string): boolean {
    if (/^\d+$/.test(input)) {
      return +input % 9 === 7;
    }
    return false;
  }

  isDivideBy7(input: string): boolean {
    if (/^\d+$/.test(input)) {
      return +input % 7 === 0;
    }
    return false;
  }

  isEqualTo(input: string): boolean {
    if (/^[a-zA-Z]/.test(input)) {
      return [
        'mahi',
        'mahindra',
        'singh',
        'dhoni',
        'india',
        'jharkhand',
        'ranchi',
        'chennai supar kings',
        'cricket',
        'wicket keeper',
        'thala',
      ].includes(input.toLowerCase());
    }
    return false;
  }

  isWordCountDivideBy7(input: string): boolean {
    return input.length % 7 === 0;
  }

  isWordCountTotal7(input: string): boolean {
    return input.length % 9 === 7;
  }

  isWordPositionIsTotal7(input: string): boolean {
    let value = 0;
    for (let i = 0; i < input.length; i++) {
      if (/^[a-zA-Z]/.test(input[i])) {
        value += input[i].toLowerCase().charCodeAt(0) - 96;
      } else if (/^\d+$/.test(input[i])) {
        value += input[i].toLowerCase().charCodeAt(0) - 48;
      }
    }

    return value % 9 === 7;
  }

  isWordPositionIsDivideBy7(input: string): boolean {
    let value = 0;
    for (let i = 0; i < input.length; i++) {
      if (/^[a-zA-Z]/.test(input[i])) {
        value += input[i].toLowerCase().charCodeAt(0) - 96;
      } else if (/^\d+$/.test(input[i])) {
        value += input[i].toLowerCase().charCodeAt(0) - 48;
      }
    }

    return value % 7 === 0;
  }
}
