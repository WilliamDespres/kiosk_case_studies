import { useLoaderData, Form } from 'react-router';
import KioskLogo from '~/assets/kiosk-logo.svg';
import { CSRDFormService } from '~/application/services/CSRDFormService';
import type { DisclosureRequirement } from '~/domain/csrd-form/DisclosureRequirement';
import type { Question } from '~/domain/csrd-form/Question';
import type { JSX } from 'react';

export function loader(): DisclosureRequirement {
  const service = new CSRDFormService();
  return service.getDisclosureRequirement();
}

export async function action() {
  return {};
}

function renderQuestionInput(question: Question) {
  const inputId = `question-${question.id}`;

  switch (question.type) {
    case 'number':
      return (
        <input
          key={inputId}
          id={inputId}
          type="number"
          name={question.id}
          placeholder="Enter a number"
        />
      );
    case 'text':
      return (
        <textarea
          key={inputId}
          id={inputId}
          name={question.id}
          placeholder="Enter text"
          rows={4}
        />
      );
    case 'enum':
      return (
        <select key={inputId} id={inputId} name={question.id}>
          <option value="">Select an option</option>
          {question.enumValues && (
            <>
              {question.enumValues.en.map((value, index) => (
                <option key={index} value={value}>
                  {value}
                </option>
              ))}
            </>
          )}
        </select>
      );
    case 'table':
    case 'section':
      return null; // These are container types, handled separately
    default:
      return null;
  }
}

function renderQuestion(question: Question, depth: number = 0): JSX.Element {
  const marginLeft = `${depth * 20}px`;

  return (
    <fieldset
      key={question.id}
      style={{ marginBottom: '20px', marginLeft: marginLeft }}
    >
      <legend>
        <strong>{question.labelEn}</strong>
      </legend>
      {question.type !== 'table' &&
        question.type !== 'section' &&
        renderQuestionInput(question)}
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
          <button type="submit">Save Answers</button>
        </div>
      </Form>
    </div>
  );
}
