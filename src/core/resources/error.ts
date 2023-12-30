import { BadRequestException, ValidationError } from '@nestjs/common';

export const customValidationFactory = (errors: ValidationError[]) => {
  const parsed = errors.reduce(
    (acc, cur) => ({
      ...acc,
      [cur.property]: Object.values(cur.constraints)[0],
    }),
    {},
  );

  return new BadRequestException({ message: 'Bad request', errors: parsed });
};
