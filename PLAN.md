# Project Modernization Plan (Refined)

## Goals

Complete the modernization of the `address-format` Express application. The codebase has already been partially migrated to Vitest, `typescript-eslint`, and Node 22. This plan focuses on **removing orphaned artifacts**, **fixing broken configurations**, **improving type safety**, and **aligning CI/CD and Docker** with the modern stack.

---

## 1. Commit Strategy

Make **frequent, small commits** as each logical change is completed. Use **Conventional Commits** style:

- `chore:` — tooling, config, dependency changes
- `feat:` — new functionality
- `fix:` — bug fixes
- `ci:` — GitHub Actions / CI changes
- `build:` — Docker, build process changes
- `refactor:` — code rewrites without behavior changes
- `test:` — test migrations or additions
- `style:` — formatting only

---

## 2. Package Management & Orphaned Artifact Cleanup

**Current state:** `package.json` is already modernized with Vitest, `typescript-eslint`, Prettier, and Node 22 engines.

**Required actions:**

- Delete `.eslintrc.json` (superseded by `eslint.config.mjs`).
- Delete `jest.config.js` (superseded by `vitest.config.ts`).
- Verify no Babel/Mocha/Jest/Chai references remain anywhere in the repo.
- Run `npm ci` to ensure `package-lock.json` is fully consistent.

> **Note:** No dependency additions or removals are needed in `package.json`. The current state already matches the target.

---

## 3. TypeScript Configuration

**Current state:** `tsconfig.json` is already modernized (`ES2022`, `Node16`, `strict: true`).

**Required actions:**

- No changes to `tsconfig.json` needed.
- Improve type safety in two specific source files:
    - `src/routes/api/api.route.ts`: Replace `req: any, res: any` with `Request`, `Response` from `express`.
    - `src/services/geocage-api-service.ts`: Replace `addressComponents: any` with a defined `OpenCageAddressComponents` interface covering all fields accessed (`house_number`, `road`, `city`, `suburb`, `county`, `town`, `state_code`, `postalCode`/`postcode`, `country`, `ISO_3166-1_alpha-2`, `ISO_3166-1_alpha-3`).

> **Note:** Other files contain additional `any` types (e.g., `src/lib/net.ts`, `src/init-app.ts`, `src/middleware/handleResponseAsJson.ts`, `src/lib/address-format-parser.ts`). These are **out of scope** for this plan unless explicitly requested.

---

## 4. Testing Migration: Jest → Vitest

**Current state:** Already migrated. `vitest.config.ts` exists and test files use Vitest globals.

**Required actions:**

- Delete `jest.config.js`.
- No test file changes needed.

---

## 5. Linting & Formatting

**Current state:** Already migrated to flat config.

**Required actions:**

- Delete `.eslintrc.json` (the old `google` preset with `mocha: true`, `ecmaVersion: 2018`, and `linebreak-style: windows`).
- Keep the existing `eslint.config.mjs` as-is. It does **not** enforce linebreak-style, which supports both Windows and Unix line endings.
- Keep the existing `prettier.config.mjs` as-is (`tabWidth: 4`, `singleQuote: true`, `semi: true`).

---

## 6. GitHub Workflows

**Current state:** `.github/workflows/run-tests.yml` references non-existent action versions (`@v6`) and tests Node 18.x/20.x/22.x.

**Required actions:**

- Rename `.github/workflows/run-tests.yml` → `.github/workflows/ci.yml`.
- Fix action versions:
    - `actions/checkout@v6` → `actions/checkout@v4`
    - `actions/setup-node@v6` → `actions/setup-node@v4`
- Narrow matrix to Node 22.x (latest stable LTS). **Node 24.x does not exist yet**; upgrade to it when it becomes available.
- Add `npm run typecheck` and `npm run lint` steps before tests.
- Keep Codecov upload for Node 22.x only.

**Suggested `ci.yml`:**

```yaml
name: CI

on:
    push:
        branches: [master, main, develop]
    pull_request:
        branches: [master, main, develop]

jobs:
    test:
        runs-on: ubuntu-latest
        strategy:
            fail-fast: false
            matrix:
                node-version: [22.x]
        steps:
            - uses: actions/checkout@v4
            - uses: actions/setup-node@v4
              with:
                  node-version: ${{ matrix.node-version }}
                  cache: 'npm'
            - run: npm ci
            - run: npm run typecheck
            - run: npm run lint
            - run: npm test
            - name: Upload coverage
              uses: codecov/codecov-action@v4
              with:
                  files: ./coverage/lcov.info
                  flags: unittests
                  fail_ci_if_error: false
                  token: ${{ secrets.CODECOV_TOKEN }}
```

**Add `.github/workflows/docker.yml`:**
Build the Docker image on PRs to catch `Dockerfile` regressions.

```yaml
name: Docker Build
on:
    pull_request:
        branches: [master, main, develop]
jobs:
    build:
        runs-on: ubuntu-latest
        steps:
            - uses: actions/checkout@v4
            - run: docker build --target production .
```

---

## 7. Docker & Compose

**Current state:** `Dockerfile` uses `node:24-bullseye-slim` (non-existent), runs `npm install`, and has a weak multi-stage build. `docker-compose.yml` uses deprecated `version: "3.7"` and extra services.

**Required actions:**

### `Dockerfile`

- Fix base image: `node:24-bullseye-slim` → `node:22-bullseye-slim`.
- Change `npm install` → `npm ci` for reproducible builds.
- Fix empty `apt-get install -y` by either adding required packages or removing it.
- Restructure as a true multi-stage build so the `production` image does not ship dev dependencies:
    - `base` stage: install build tools, copy source.
    - `dependencies` stage: run `npm ci`.
    - `production` stage: copy `node_modules` and build output, run `npm ci --omit=dev`.

### `docker-compose.yml`

- Remove deprecated top-level `version: "3.7"` field.
- Remove the extra services (`api-dev`, `api-test`) and keep only a single `api` service.
- Simplified `docker-compose.yml` example:
    ```yaml
    services:
        api:
            container_name: api
            build:
                context: .
                target: production
            ports:
                - '3000:3000'
            networks:
                - api_network
            environment:
                - NODE_ENV=production
                - PORT=3000
            env_file:
                - '.env'
            command: npm run start
    networks:
        api_network:
            driver: bridge
    ```

---

## 8. Renovate Configuration

**Current state:** `renovate.json` uses deprecated `config:base` and only auto-merges minor/patch/pin/digest.

**Required actions:**

- Update `renovate.json` to auto-merge all updates (including major) while respecting CI status.
- Renovate should **not** merge if unit tests fail.

**Suggested `renovate.json`:**

```json
{
    "$schema": "https://docs.renovatebot.com/renovate-schema.json",
    "extends": [
        "config:recommended",
        ":automergeAll",
        ":automergeRequireAllStatusChecks"
    ],
    "lockFileMaintenance": {
        "enabled": true,
        "automerge": true
    },
    "packageRules": [
        {
            "matchUpdateTypes": ["minor", "patch", "pin", "digest"],
            "automerge": true
        },
        {
            "matchUpdateTypes": ["major"],
            "automerge": true
        }
    ]
}
```

> **Note:** `:automergeRequireAllStatusChecks` ensures that PRs are only auto-merged when all required status checks (e.g., CI tests) pass.

---

## 9. Misc Files

- **`.nvmrc`**: create with contents `22` to signal the local Node version.
- **`.vscode/settings.json`**: create to enable "Format on Save" with Prettier and associate `.mjs` configs.

---

## Implementation Order

1. `chore(deps):` Delete orphaned `.eslintrc.json` and `jest.config.js`; verify `package.json` is clean.
2. `chore(tsconfig):` Acknowledge modern `tsconfig.json` state; no file changes needed.
3. `test(vitest):` Acknowledge Vitest migration; delete `jest.config.js` if not done in step 1.
4. `chore(lint):` Acknowledge modern ESLint/Prettier configs; ensure `.eslintrc.json` is removed.
5. `refactor(types):` Replace `any` types in `api.route.ts` and `geocage-api-service.ts`.
6. `ci:` Rename and update GitHub workflows (`ci.yml`, `docker.yml`).
7. `build(docker):` Fix `Dockerfile` base image, use `npm ci`, and simplify `docker-compose.yml` to a single service.
8. `chore(renovate):` Update `renovate.json` for auto-merge with status checks.
9. `chore:` Create `.nvmrc` and `.vscode/settings.json`.
10. Run full verification: `npm ci`, `npm run typecheck`, `npm run lint`, `npm test`, `docker build --target production .`.

---

## Acceptance Criteria

- [ ] `npm ci` completes with no unnecessary packages.
- [ ] `npm run typecheck` passes with zero errors.
- [ ] `npm run lint` passes.
- [ ] `npm test` passes under Vitest.
- [ ] GitHub Actions `ci.yml` runs successfully on Node 22.x.
- [ ] `docker build --target production .` succeeds.
- [ ] `docker-compose up` works with the single `api` service.
- [ ] Renovate is configured to auto-merge latest versions (including major) only when CI passes.
- [ ] Orphaned `.eslintrc.json` and `jest.config.js` are removed.
- [ ] `req: any` / `res: any` in `api.route.ts` are replaced with proper Express types.
- [ ] `addressComponents: any` in `geocage-api-service.ts` is replaced with a defined interface.

---

## Audit Notes

- **Partial modernization detected:** `package.json`, `tsconfig.json`, `vitest.config.ts`, `eslint.config.mjs`, and `prettier.config.mjs` are already in the desired target state. No modifications are required for these files.
- **Node 24.x:** Does not exist as of this plan. The project targets Node 22.x (latest stable LTS). Update `Dockerfile` and CI matrix to Node 24.x once it is officially released.
- **Additional `any` types:** Found in `src/lib/net.ts`, `src/init-app.ts`, `src/middleware/handleResponseAsJson.ts`, and `src/lib/address-format-parser.ts`. These were noted but are **out of scope** per the current plan and can be addressed in a follow-up refactor.
