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

### Visual Regression Tests (Lost Pixel)

Visual/snapshot tests are run locally using [Lost Pixel OSS](https://github.com/lost-pixel/lost-pixel). Baseline screenshots are stored in `.lostpixel/baseline/` and committed to git. On each run, Lost Pixel screenshots every story and diffs them against the baseline, failing if anything has changed unexpectedly.

```bash
# Build Storybook first, then run visual regression
yarn build-storybook && yarn lost-pixel
```

To accept intentional visual changes and update the baselines:

```bash
yarn lost-pixel:update
```

To run or update against a specific component only, use the `LOST_PIXEL_FILTER` env var with any substring of the story ID (e.g. `atoms-button--default`):

```bash
LOST_PIXEL_FILTER=calendar yarn lost-pixel
LOST_PIXEL_FILTER=calendar yarn lost-pixel:update
```

#### Reviewing failures

When a test fails, three folders are populated for comparison:

| Folder                   | Contents                                         |
| ------------------------ | ------------------------------------------------ |
| `.lostpixel/baseline/`   | Committed reference screenshots                  |
| `.lostpixel/current/`    | Screenshots from the latest run                  |
| `.lostpixel/difference/` | Red-highlighted diff images showing what changed |

Open the difference folder in Finder to quickly review failures:

```bash
open .lostpixel/difference/
```

Only `.lostpixel/baseline/` is committed to git. The `current/` and `difference/` folders are gitignored as they are regenerated on each run.
