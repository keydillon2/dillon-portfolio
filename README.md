# dillonkey.com

The portfolio site of Dillon Key, brand strategist in New York. Live at https://www.dillonkey.com.

## Stack

- **Next.js** (App Router) on **Vercel**, with a preview deployment for every pull request.
- **Sanity** for case study content (Studio at `/studio`).
- **Groq** (gpt-oss-120b) for the chat assistant at the bottom of every page.

## Working on it

Read [CLAUDE.md](CLAUDE.md) first. In short: `main` is the live site and only accepts reviewed pull requests; every change gets a preview; content edits in Sanity publish immediately.

```bash
npm ci
npm run dev      # http://localhost:3000
```

Checks that run on every pull request (and must pass):

```bash
npx next typegen && npx tsc --noEmit
npx eslint app lib sanity
npx next build
```

Secrets (`GROQ_API_KEY`, and optionally `QUESTIONS_PASSWORD` and the Redis store) live in Vercel's environment variables, never in the repository.

## Security

See [SECURITY.md](SECURITY.md) to report a problem.

## Rights

The code and content are © Dillon Key. All rights reserved; no license is granted.
