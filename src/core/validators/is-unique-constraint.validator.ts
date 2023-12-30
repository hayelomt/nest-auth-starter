import { Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { IsUniqueInterface } from '../types/unique.type';
import { PrismaService } from '../prisma/prisma.service';

@ValidatorConstraint({ name: 'IsUniqueConstraint', async: true })
@Injectable()
export class IsUniqueConstraint implements ValidatorConstraintInterface {
  constructor(private readonly prisma: PrismaService) {}

  async validate(value: any, args?: ValidationArguments): Promise<boolean> {
    const { table, column }: IsUniqueInterface = args.constraints[0];

    const user = await (this.prisma as any)[table].findUnique({
      where: {
        [column]: value,
      },
    });

    return !user;
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    const field: string = validationArguments.property;

    return `${field} already exists`;
  }
}
