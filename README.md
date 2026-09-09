# Frontend Reference App

The companion application for `frontend-starter`.

It is a working pattern catalogue: feature routes, state services, forms, dialogs, page states, secure preferences, role-aware navigation, breadcrumbs, and responsive layouts. Read this project when you want an example; start new product work from `frontend-starter`.

## Run it

```bash
npm ci
npm run start:reference
```

Open `http://localhost:4301`. This port lets it run alongside the starter on port 4200.

## What is real and what is illustrative

- Dashboard, Users, and Projects use local fixture adapters so the app runs without a product backend.
- Activity uses the configured external public activity endpoint.
- Sign-in is a demo cookie session only. It is not a production authentication implementation; see the starter guide for the cookie and bearer-token integration contract.
- Before copying a feature into a product, replace fixture adapters with typed backend adapters and retain the feature structure, tests, and route metadata.

## Explore the examples

- **Projects** — list, detail, edit form, project-name breadcrumb, and unsaved-change protection.
- **Users** — role-protected route, table, modal form, and validation.
- **Activity** — external HTTP boundary and retryable states.
- **Settings** — encrypted non-auth browser preferences.

## Validate changes

```bash
npm run format:check
npm run lint
npm run typecheck
npm run architecture:validate
npm test
npm run test:e2e
npm run build
```

Install the Playwright browser once before running browser tests:

```bash
npx playwright install chromium
```

For architecture, security, packages, and feature-development rules, read the [Engineering Guide](../frontend-starter/docs/engineering-guide.md) and [Stack and Libraries Guide](../frontend-starter/docs/stack-and-libraries.md).
