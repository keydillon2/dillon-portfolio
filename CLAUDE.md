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

## Before opening a pull request

- `npx tsc --noEmit`, `npx eslint app lib sanity`, and `next build` pass.
- Check the page in light, dark, and at 390px wide.
- Pages must still render if new optional Sanity fields are empty.
