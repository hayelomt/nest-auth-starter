import { PrismaClient } from '@prisma/client';

export type IsUniqueInterface = {
  table: keyof PrismaClient;
  column: string;
};
