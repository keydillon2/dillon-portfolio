@AGENTS.md

# Working on this site: do no harm

`main` is the live site at https://www.dillonkey.com. Anything merged into
`main` deploys to the public within about a minute. Everything else is a
sandbox.

## Rules

1. **Never push to `main`.** GitHub enforces this: `main` only accepts merged
   pull requests, and the rule applies to admins too.
2. **One branch per change.** Branch from `main`, commit there, and open a
   pull request. Vercel builds a preview for every pull request.
3. **Show Dillon the preview before anything else.** Preview links require
   a Vercel login (Vercel Authentication, Standard Protection), so they are
   private. To share one with a reviewer, use Vercel's "Share" link.
4. **Merge only on Dillon's explicit go-ahead for that pull request.** A
   go-ahead for one change is not a go-ahead for the next.
5. **Rolling back:** in Vercel, Deployments → the last good production
   deploy → "Instant Rollback". Then fix forward on a branch.

## Content (Sanity) has no sandbox

Studio edits are drafts until **Publish** is pressed. Publishing updates the
live site within a minute, whatever branch the code is on. So:

- Draft freely; publish only when the change is ready to be public.
- New schema fields are safe to fill in before the code that renders them
  is merged: the live site ignores fields it doesn't query.
- Scripts that write to Sanity (e.g. `sanity/seed/*`) write published
  content. Say so before running one, and get Dillon's OK.

## Security and quality guardrails

- GitHub runs CI (typecheck, lint, build), CodeQL, and dependency review on every
  pull request. Don't ask Dillon to merge until they pass.
- Dependabot opens weekly update PRs. Treat them like any other change: preview,
  then merge on Dillon's go-ahead.
- Workflows get read-only tokens by default and pin third-party actions to a
  commit SHA (with the version in a comment). Keep it that way.
- Secrets live only in Vercel environment variables. Never commit them, print them,
  or put them in URLs. Dillon creates and pastes keys himself.
- The chat assistant treats visitor text as untrusted: it may only answer from the
  site content and resume, never take actions, and has token and rate limits.
- New dependencies: check the package is real, maintained and widely used before
  adding it.

## Before opening a pull request

- `npx tsc --noEmit`, `npx eslint app lib sanity`, and `next build` pass.
- Check the page in light, dark, and at 390px wide.
- Pages must still render if new optional Sanity fields are empty.

## Where things live (identify by ID, not name)

- **Code:** this repo, `keydillon2/dillon-portfolio`. The similarly named
  `dillon-key-portfolio` and `Dillon-Key` repos are unrelated.
- **Hosting:** Vercel project `dillon-portfolio` (not `dillon-key`).
- **Content:** Sanity project "Dillon Portfolio", ID `7sgn2ssa`, owned by
  the GitHub-based Sanity login (keydillon2). Never delete it or that
  account. The Google login's "Dillon's Portfolio" projects (`5k98eyyu`,
  `0wmbny9z`) are empty duplicates.
- **Domain:** dillonkey.com at WordPress.com, pointed at Vercel.
