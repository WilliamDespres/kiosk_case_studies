import type { Question } from '~/domain/csrd-form/Question';

export default function QuestionInput(props: { question: Question }) {
  const question = props.question;
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
