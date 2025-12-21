# Kiosk — Frontend — William Després

Short notes for running and understanding my implementation of the case study.

## How to run

I did not change anything to the existing setup. So, to run the project, you need to follow the same instructions as in the base README:

- Install dependencies:

```bash
pnpm install
```

- Start PostgreSQL (Docker):

```bash
docker-compose up -d
```

- Run migrations and generate Prisma client:

```bash
pnpm migrate
pnpm prisma generate
```

- Start the dev server:

```bash
pnpm dev
```

App will be available at `http://localhost:5173`.

The answers will be saved to the database using the provided credentials.

## AI usage

- I used the AI assistant Copilot, powered by Claude, to implement and refactor parts of the code.
- Most main features were developed using AI, including:
  - Fetching and rendering questions
  - Adding recursive rendering of nested questions so related questions render at any depth.
  - Implementing `action()` function to parse `FormData` and save answers to the database.
  - Displaying a simple "Done!" banner using `useActionData()` after submit.

- All AI-suggested changes were reviewed and adjusted manually in the codebase.

## What I'd improve next

- Add server-side and client-side validation for answers (matching question type).
- Add error handling and user-friendly feedback for save failures and successes.
- Add mandatory or optional fields management.
- Add a route displaying previously saved answers.
- Persist answers per user/session.
- Add unit and integration tests for `CSRDFormService` and the `Home` component.
