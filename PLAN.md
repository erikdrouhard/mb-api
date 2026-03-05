# Phase 1: Auth Rebuild + Error Handling Overhaul

## Context
- Production API, own frontend, PaaS deployment (Heroku/Railway/Render)
- Multi-user, same role, admin-created accounts
- Keep it simple, no over-engineering
- Jest for testing (consider Bun migration in Phase 2)

---

## Step 1: Install missing @types and dev dependencies

**Why first:** Everything else is harder without type safety.

- Install missing `@types/express`, `@types/bcrypt`, `@types/jsonwebtoken`, `@types/cors`, `@types/morgan`
- Remove dead dependency: `fs` (built-in), `csv-parser` (unused — papaparse is used instead)
- Install `jest`, `ts-jest`, `@types/jest`, `supertest`, `@types/supertest`

---

## Step 2: Fix Prisma schema type mismatch

- Change `backerNumber` from `String?` to `Int?` in `prisma/schema.prisma`
- Generate new Prisma client
- Create migration
- Update seed.ts to parse backerNumber as integer

---

## Step 3: Rebuild auth from scratch

**Files:** `src/modules/auth.ts`, `src/handlers/user.ts`

### Auth module (`src/modules/auth.ts`):
- Add proper TypeScript types to all functions
- Validate JWT_SECRET exists at startup (fail fast, not at request time)
- Fix `createJWT`: type the user param, use proper expiry
- Fix `protect` middleware: proper response termination (`return res.status(401).json(...)`)
- Increase bcrypt salt rounds from 5 → 10
- Add `hashPassword` and `comparePasswords` as clean exports

### User handlers (`src/handlers/user.ts`):
- `createNewUser`: Add input validation, proper error handling, null checks
- `signInUser`: Add try/catch, null check for user lookup, proper error responses
- Both handlers get proper TypeScript types

### Wire it up in `server.ts`:
- Uncomment and enable `protect` middleware on `/api` routes
- Register `/user` (POST) and `/signin` (POST) routes
- Auth routes stay outside the `protect` middleware (public endpoints)
- Since accounts are admin-created: add protect to the `/user` creation route too (only authenticated users can create new users)

---

## Step 4: Error handling overhaul

### Create consistent error pattern:
- Fix all `res.status(X); res.json(...)` → `return res.status(X).json(...)` across entire codebase
- Ensure every handler uses try/catch with `next(e)` for the global error handler

### Fix global error handler (`server.ts`):
- Handle Prisma-specific errors (unique constraint, not found, validation)
- Handle JWT errors (expired, malformed)
- Don't leak error details in production
- Log errors properly

### Fix router error handler (`router.ts`):
- Remove duplicate error handler in router (let errors bubble to global handler)

### Fix middleware (`src/modules/middleware.ts`):
- `handleInputErrors`: integrate with global error handler via `next()`

---

## Step 5: Add foundational tests

### Setup:
- Configure Jest with `ts-jest`
- Add `jest.config.ts`
- Add test scripts to `package.json`

### Tests to write:
- `src/modules/__tests__/auth.test.ts`: Unit tests for createJWT, hashPassword, comparePasswords, protect middleware
- `src/handlers/__tests__/user.test.ts`: Unit tests for createNewUser, signInUser with mocked Prisma
- Integration smoke test: verify protected routes return 401 without token

---

## Step 6: Environment & config cleanup

- Create `.env.example` with all required variables documented
- Validate required env vars at startup in `src/config/index.ts` (fail fast with clear error messages)
- Fix config system: replace `require()` with proper imports

---

## Out of scope (Phase 2):
- Rate limiting & helmet (security hardening)
- Bun migration
- `tsconfig.json` strict mode
- Full integration test suite with test database
- CI/CD pipeline
