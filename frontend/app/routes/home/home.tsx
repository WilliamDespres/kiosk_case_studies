import { useLoaderData, Form, useActionData } from 'react-router';
import KioskLogo from '~/assets/kiosk-logo.svg';
import { CSRDFormService } from '~/application/services/CSRDFormService';
import type { DisclosureRequirement } from '~/domain/csrd-form/DisclosureRequirement';
import type { Question } from '~/domain/csrd-form/Question';
import QuestionInput from '~/routes/home/components/QuestionInput';
import type { CreateQuestionAnswerDTO } from '~/domain/csrd-form/QuestionAnswer';

export function loader(): DisclosureRequirement {
  const service = new CSRDFormService();
  return service.getDisclosureRequirement();
}

export async function action({ request }: { request: Request }) {
  const service = new CSRDFormService();

  const formData = await request.formData();
  const dtos: CreateQuestionAnswerDTO[] = [];

  for (const [key, value] of formData.entries()) {
    if (!value) {
      continue;
    }

    dtos.push({
      questionId: key,
      answer: Number.isNaN(Number(value)) ? (value as string) : Number(value),
    });
  }

  if (!dtos.length) {
    return { ok: false };
  }

  await service.saveAnswers(dtos);
  return { ok: true };
}

function renderQuestion(question: Question, depth: number = 0) {
  const marginLeft = `${depth * 20}px`;

  return (
    <fieldset
      key={question.id}
      style={{ marginBottom: '20px', marginLeft: marginLeft }}
    >
      <legend>
        <strong>{question.labelEn}</strong>
      </legend>
      {question.type !== 'table' && question.type !== 'section' && (
        <QuestionInput question={question} />
      )}
      {question.relatedQuestions && question.relatedQuestions.length > 0 && (
        <div>
          {question.relatedQuestions.map((relatedQuestion) =>
            renderQuestion(relatedQuestion, depth + 1),
          )}
        </div>
      )}
    </fieldset>
  );
}

export default function CSRDFormPage() {
  const disclosureRequirement = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  return (
    <div>
      <img src={KioskLogo} alt="Kiosk Logo" width="200" />

      <h1>CSRD Disclosure Requirement Form</h1>
      <Form method="post">
        <div>
          <h2>Questions</h2>
          {disclosureRequirement.questions.map((question) =>
            renderQuestion(question),
          )}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="submit">Save Answers</button>
            {actionData && actionData.ok && (
              <div style={{ background: '#e6ffe6', paddingInline: '8px' }}>
                Done!
              </div>
            )}
          </div>
        </div>
      </Form>
    </div>
  );
}
