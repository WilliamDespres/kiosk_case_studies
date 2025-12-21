import type { DisclosureRequirement } from "~/domain/csrd-form/DisclosureRequirement";
import type {
  CreateQuestionAnswerDTO,
  QuestionAnswer,
} from "~/domain/csrd-form/QuestionAnswer";
import { QuestionAnswerRepository } from "~/infrastructure/database/QuestionAnswerRepository";
import drData from "~/data/disclosure-requirement.json";

export class CSRDFormService {
  private readonly questionAnswerRepository: QuestionAnswerRepository;

  constructor() {
    this.questionAnswerRepository = new QuestionAnswerRepository();
  }

  getDisclosureRequirement(): DisclosureRequirement {
    return drData as DisclosureRequirement;
  }

  async saveAnswer(dto: CreateQuestionAnswerDTO): Promise<QuestionAnswer> {
    return this.questionAnswerRepository.create(dto);
  }

  async saveAnswers(
    dtos: ReadonlyArray<CreateQuestionAnswerDTO>,
  ): Promise<ReadonlyArray<QuestionAnswer>> {
    return this.questionAnswerRepository.createMany(dtos);
  }

  async getAnswerByQuestionId(
    questionId: string,
  ): Promise<QuestionAnswer | null> {
    return this.questionAnswerRepository.findByQuestionId(questionId);
  }
}
