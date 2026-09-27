# Home Automation Frontend

A [Next.js](https://nextjs.org) frontend for home automation, built with Chakra UI and Storybook.

## Getting Started

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Authentication flow

Protected routes use a two-step auth check:

1. A proxy-level check in [src/proxy.ts](src/proxy.ts) runs before the request reaches the page.
2. A server-side validation in [src/utils/requireAuth.ts](src/utils/requireAuth.ts) runs from the protected layout in [src/app/(protected)/layout.tsx](src/app/%28protected%29/layout.tsx).

### 1. Proxy guard

The `proxy()` function in [src/proxy.ts](src/proxy.ts#L5-L31) is responsible for a lightweight first-pass check on protected routes matched by [src/proxy.ts](src/proxy.ts#L34-L36).

It:

- reads the `stytch_session_jwt` cookie
- builds a `/login?redirect=...` redirect URL so the app can remember the original destination
- redirects immediately if the JWT is missing
- decodes the JWT and checks that `exp` exists
- redirects if the token is expired
- allows the request through only when the token is present and appears non-expired

This keeps obviously unauthenticated or expired requests from reaching protected pages.

### 2. Server-side token validation

The actual token validation happens in `reqStorybook uireAuth()` in [src/utils/requireAuth.ts](src/utils/requireAuth.ts#L10-L27).

`requireAuth()`:

- reads the `stytch_session_jwt` cookie on the server
- redirects to `/login` if the cookie is missing
- calls `stytchClient.sessions.authenticateJwt()` to validate the JWT with Stytch
- returns the authenticated session when valid
- redirects to `/login` if validation fails for any reason

### 3. Protected layout enforcement

The protected app layout in [src/app/(protected)/layout.tsx](src/app/%28protected%29/layout.tsx#L1-L7) calls `await requireAuth()` before rendering children.

That means every page nested under the protected route group gets a server-side auth check automatically:

- invalid or missing tokens are redirected away
- valid tokens are allowed to render the protected UI

### Summary

In practice, auth works like this:

- the proxy blocks requests that have no JWT or an already expired JWT
- the protected layout calls `requireAuth()`
- `requireAuth()` performs the authoritative Stytch JWT validation
- only valid sessions are allowed to render protected routesProject structure

## Project structure

This project follows atomic design. Templates are used for full page view and then referenced via the page itself. This means we can do storybook testing without needing to use the real methods for things like validating login etc, we can just mock all that to ensure the page works and renders neatly. You should have no storybook file in the pages folder. These can be tested via E2E testing instead.

## Deployment

The app is deployed to AWS (production only) at https://home-automation-v2.andrewhurt.co.uk using [OpenNext](https://opennext.js.org/aws) and CDK.

`yarn build:open-next` runs `next build` and converts the output into Lambda bundles and static assets in `.open-next/` (see [open-next.config.ts](open-next.config.ts)). The CDK app in [bin/main.ts](bin/main.ts) then reads `.open-next/open-next.output.json` and deploys, via [cdk/constructs/NextjsSite.ts](cdk/constructs/NextjsSite.ts):

- an S3 bucket holding static assets (`_assets/`) and prerendered pages (`_cache/`)
- a server Lambda (Next.js server, including [src/proxy.ts](src/proxy.ts)) and an image optimisation Lambda, each behind a function URL
- a CloudFront distribution on the custom domain, routing `_next/*` and `public/` files to S3 and everything else to the server Lambda

The certificate is an ACM certificate in **us-east-1** (a CloudFront requirement) created outside CDK; its ARN lives in [cdk/constants/CertificateArns.ts](cdk/constants/CertificateArns.ts). DNS is managed at names.co.uk.

Pushes to `main` run [.github/workflows/deploy.yml](.github/workflows/deploy.yml): typecheck, lint, CDK tests, Storybook interaction tests and Cypress E2E (against the dev backend), then deploy to prod. Pull requests run the same checks without deploying.

To deploy manually (the shell env must hold the **prod** values, as they override `.env` during the build):

```bash
NEXT_PUBLIC_STYTCH_PUBLIC_TOKEN=... API_KEY=... STYTCH_PROJECT_ID=... STYTCH_SECRET=... yarn deploy:prod
```

CDK tests run with `yarn test:cdk`.

## Storybook

```bash
yarn storybook
```

Opens Storybook at [http://localhost:6006](http://localhost:6006) for component development and testing.

## Testing

### Interaction Tests (Storybook)

Interaction tests are written as `play` functions inside `.stories.tsx` files and run via [Vitest](https://vitest.dev/) with a real Playwright browser. They verify component behaviour such as user clicks, form submission, and callback invocations.

```bash
yarn test-storybook
```

Results are also shown live in the **Tests** panel inside Storybook.

### End-to-End Tests (Cypress)

Cypress is configured for the real login flow and meal-plans backend using the credentials and API settings from `.env`.

Start the app locally first:

```bash
yarn dev
```

Then run the E2E suite:

```bash
yarn cypress:run
```

Or open the Cypress runner:

```bash
yarn cypress:open
```
