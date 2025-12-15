# Copilot Instructions for Kiosk Frontend

## Project Overview

CSRD (Corporate Sustainability Reporting Directive) disclosure form application built with React Router V7, TypeScript, Prisma, and PostgreSQL. The form allows users to view and answer sustainability questions, persisting responses to a database.

## Architecture & Key Patterns

### Domain-Driven Design (DDD) Structure

- **Domain Layer** (`app/domain/csrd-form/`): Core types - `Question`, `DisclosureRequirement`, `QuestionAnswer`
  - Use `readonly` properties and `ReadonlyArray` for immutability
  - `Question` supports multiple types: `"table" | "number" | "enum" | "text" | "section"`
  - `QuestionAnswer` wraps Prisma's `Json` type for flexible answer storage
- **Application Layer** (`app/application/services/`): `CSRDFormService` orchestrates data access
  - Service loads `disclosure-requirement.json` via `getDisclosureRequirement()`
  - Repository methods: `saveAnswer()`, `saveAnswers()`, `getAnswerByQuestionId()`
- **Infrastructure Layer** (`app/infrastructure/database/`): `QuestionAnswerRepository` handles persistence
  - Direct Prisma integration via `prisma-client.ts`
  - Converts Prisma models to domain interfaces

### Data Flow

1. React Router `loader` → fetch `CSRDFormService.getDisclosureRequirement()`
2. Component renders questions from nested tree structure (`relatedQuestions` field)
3. Form submission → `CSRDFormService.saveAnswer()` or `saveAnswers()`
4. Answers stored as JSON in PostgreSQL `question_answers` table

## Critical Developer Workflows

### Setup & Database

```bash
pnpm install                    # Install dependencies
docker-compose up              # Start PostgreSQL (port 5438)
pnpm migrate                   # Run Prisma migrations
pnpm prisma generate           # Generate Prisma client
pnpm dev                       # Start React Router dev server (port 5173)
```

### Testing & Type Safety

```bash
pnpm test                      # Run Vitest in watch mode
pnpm test:run                  # Run tests once
pnpm test:ui                   # Open Vitest UI dashboard
pnpm typecheck                 # Run `tsc` and React Router type generation
pnpm build                     # Production build via React Router
```

### Database & Prisma

- Prisma schema: `prisma/schema.prisma` - keep in sync with migrations
- PostgreSQL connection: `DATABASE_URL=postgresql://csrd:csrd_password@localhost:5438/csrd_db`
- Use `@prisma/adapter-pg` for native PostgreSQL driver
- All queries through `prisma` singleton from `app/infrastructure/database/prisma-client.ts`

## Project Conventions

### TypeScript & Strict Mode

- All compiler flags in `tsconfig.json` enabled (strict, noUnusedLocals, noImplicitAny)
- Path alias: `~/` → `app/` (configured in tsconfig + react-router.config.ts)
- No `any` types; leverage `Prisma.JsonValue` for flexible data

### React Router V7 (Framework Mode)

- Single route: `app/routes/home.tsx` handles all UI
- `loader()` function fetches initial data on route entry
- `action()` function handles form submissions (POST/PUT/DELETE)
- Use Route.loader/action type helpers from `@react-router/dev/routes`

### File Organization

- Data files in `app/data/` (e.g., `disclosure-requirement.json` with nested question tree)
- Services initialize repositories internally (no factory pattern needed)
- Tests colocate with implementation (`.test.ts` suffix)

## Integration Points & Dependencies

### External Packages

- **React Router V7**: Framework routing, data loading, form actions
- **Prisma 7**: ORM with PostgreSQL adapter
- **TypeScript 5.9**: Strict compilation
- **Vitest 4**: Testing framework (Jest-compatible)
- **Vite 7**: Build bundler (optimized for React Router)

### Key Configuration Files

- `vite.config.ts`: Uses `@react-router/dev/vite` plugin and TypeScript path resolution
- `vitest.config.ts`: Inherits from Vite config
- `react-router.config.ts`: Currently empty; will define routes if needed beyond `app/routes/`

## Testing & Test Data

- Tests use **Vitest** (in `**/*.test.ts` files)
- `CSRDFormService.test.ts` and `QuestionAnswerRepository.test.ts` provide patterns
- Test data: `disclosure-requirement.json` contains real CSRD questions with i18n labels (`labelEn`, `labelFr`)
- Nested questions via `relatedQuestionId` + `relatedQuestions` array; use for building question groups/tables

## Implementation Guidelines for Completion

1. **Form Component** (`app/routes/home.tsx`):

   - Fetch DR via `loader()` using `CSRDFormService`
   - Render questions respecting `type` and `order` fields
   - Handle nested `relatedQuestions` (e.g., table rows)
   - Build form inputs matching question type

2. **Form Submission**:

   - Use React Router `action()` to persist via `CSRDFormService.saveAnswer()`
   - Validate answers match question type constraints
   - Return success/error feedback to component

3. **Database Persistence**:
   - Answer JSON schema must match question type (number, string, array, object)
   - `questionId` uniquely identifies which question is answered
   - Allow multiple answers per question (timestamps tracked via `updatedAt`)

## Known Limitations & Trade-offs

- Single `question_answers` table with JSON flexibility vs. normalized schema
- Disclosure requirement loaded from static JSON; no dynamic DR loading yet
- No user/session tracking; all answers global per question
