# Home Automation Frontend

A [Next.js](https://nextjs.org) frontend for home automation, built with Chakra UI and Storybook.

## Getting Started

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

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
