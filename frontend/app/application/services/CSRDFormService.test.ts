import { describe, it, expect, beforeEach, vi } from "vitest";
import { CSRDFormService } from "./CSRDFormService";
import type { CreateQuestionAnswerDTO } from "~/domain/csrd-form/QuestionAnswer";

// Mock the repository
vi.mock("../../infrastructure/database/QuestionAnswerRepository", () => {
  class MockQuestionAnswerRepository {
    async create(dto: CreateQuestionAnswerDTO) {
      return Promise.resolve({
        id: "test-id-123",
        questionId: dto.questionId,
        answer: dto.answer,
        createdAt: new Date("2024-01-01T00:00:00Z"),
        updatedAt: new Date("2024-01-01T00:00:00Z"),
      });
    }

    async createMany(dtos: ReadonlyArray<CreateQuestionAnswerDTO>) {
      return Promise.resolve(
        dtos.map((dto, index) => ({
          id: `test-id-${index}`,
          questionId: dto.questionId,
          answer: dto.answer,
          createdAt: new Date("2024-01-01T00:00:00Z"),
          updatedAt: new Date("2024-01-01T00:00:00Z"),
        }))
      );
    }

    async findByQuestionId(questionId: string) {
      if (questionId === "existing-question") {
        return Promise.resolve({
          id: "test-id-123",
          questionId: "existing-question",
          answer: "Previous answer",
          createdAt: new Date("2024-01-01T00:00:00Z"),
          updatedAt: new Date("2024-01-01T00:00:00Z"),
        });
      }
      return Promise.resolve(null);
    }
  }

  return {
    QuestionAnswerRepository: MockQuestionAnswerRepository,
  };
});

describe("CSRDFormService", () => {
  let service: CSRDFormService;

  beforeEach(() => {
    service = new CSRDFormService();
  });

  describe("getDisclosureRequirement", () => {
    it("should return the disclosure requirement with questions", () => {
      const dr = service.getDisclosureRequirement();

      expect(dr).toBeDefined();
      expect(dr.id).toBeDefined();
      expect(dr.questions).toBeDefined();
      expect(Array.isArray(dr.questions)).toBe(true);
      expect(dr.questions.length).toBeGreaterThan(0);
    });

    it("should return questions with correct structure", () => {
      const dr = service.getDisclosureRequirement();
      const firstQuestion = dr.questions[0];

      expect(firstQuestion).toHaveProperty("id");
      expect(firstQuestion).toHaveProperty("kioskId");
      expect(firstQuestion).toHaveProperty("labelEn");
      expect(firstQuestion).toHaveProperty("labelFr");
      expect(firstQuestion).toHaveProperty("type");
      expect(firstQuestion).toHaveProperty("order");
    });
  });

  describe("saveAnswer", () => {
    it("should save a single answer with string value", async () => {
      const dto: CreateQuestionAnswerDTO = {
        questionId: "S1.SBM-3_01",
        answer: "Yes",
      };

      const result = await service.saveAnswer(dto);

      expect(result).toBeDefined();
      expect(result.id).toBe("test-id-123");
      expect(result.questionId).toBe("S1.SBM-3_01");
      expect(result.answer).toBe("Yes");
    });

    it("should save a single answer with boolean value", async () => {
      const dto: CreateQuestionAnswerDTO = {
        questionId: "S1.SBM-3_01",
        answer: true,
      };

      const result = await service.saveAnswer(dto);

      expect(result).toBeDefined();
      expect(result.answer).toBe(true);
    });

    it("should save a single answer with number value", async () => {
      const dto: CreateQuestionAnswerDTO = {
        questionId: "S1.SBM-3_01",
        answer: 42,
      };

      const result = await service.saveAnswer(dto);

      expect(result).toBeDefined();
      expect(result.answer).toBe(42);
    });

    it("should save a single answer with object value", async () => {
      const dto: CreateQuestionAnswerDTO = {
        questionId: "S1.SBM-3_01",
        answer: { value: "test", metadata: { source: "manual" } },
      };

      const result = await service.saveAnswer(dto);

      expect(result).toBeDefined();
      expect(result.answer).toEqual({ value: "test", metadata: { source: "manual" } });
    });
  });

  describe("saveAnswers", () => {
    it("should save multiple answers", async () => {
      const dtos: ReadonlyArray<CreateQuestionAnswerDTO> = [
        { questionId: "Q1", answer: "Answer 1" },
        { questionId: "Q2", answer: true },
        { questionId: "Q3", answer: 123 },
      ];

      const results = await service.saveAnswers(dtos);

      expect(results).toBeDefined();
      expect(results.length).toBe(3);
      expect(results[0].questionId).toBe("Q1");
      expect(results[1].questionId).toBe("Q2");
      expect(results[2].questionId).toBe("Q3");
    });

    it("should handle empty array", async () => {
      const results = await service.saveAnswers([]);

      expect(results).toBeDefined();
      expect(results.length).toBe(0);
    });
  });

  describe("getAnswerByQuestionId", () => {
    it("should return existing answer", async () => {
      const result = await service.getAnswerByQuestionId("existing-question");

      expect(result).toBeDefined();
      expect(result?.questionId).toBe("existing-question");
      expect(result?.answer).toBe("Previous answer");
    });

    it("should return null for non-existing answer", async () => {
      const result = await service.getAnswerByQuestionId("non-existing-question");

      expect(result).toBeNull();
    });
  });
});
