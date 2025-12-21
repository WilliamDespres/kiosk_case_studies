import type { Prisma } from '@prisma/generated/client';

export type AnswerValue = Prisma.JsonValue;

export interface QuestionAnswer {
  readonly id: string;
  readonly questionId: string;
  readonly answer: AnswerValue;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface CreateQuestionAnswerDTO {
  readonly questionId: string;
  readonly answer: Prisma.InputJsonValue;
}
