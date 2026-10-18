# romanfaeh.com

Personal website built with [Astro Cactus](https://github.com/chrismwilliams/astro-theme-cactus), deployed through the existing Vercel project.

## Local development

Use Node.js 24 (see `.nvmrc`) and pnpm 12.5.1 (pinned in `package.json`).

```sh
pnpm install --frozen-lockfile
pnpm dev
pnpm exec astro check
pnpm build
pnpm preview
```

`pnpm build` generates the static website in `dist/` and runs Pagefind through the `postbuild` script. No environment variables are required. Webmentions are optional; see `.example.env`.

## Structure and content

- `src/site.config.ts`: domain, metadata, navigation and theme settings.
- `src/pages/`: homepage, about page, blog, notes, tags and feeds.
- `content/posts/`: new Markdown or MDX blog posts.
- `content/notes/`: new notes.
- `content/tags/`: optional tag descriptions.
- `public/`: favicon and default social card.

The relaunch intentionally starts with empty content collections. No previous blog posts, old article assets, theme demo posts, notes or tag examples are included. Blog and notes indexes show an empty state until content is added.

## Deployment

The canonical site URL is `https://romanfaeh.com/`. `vercel.json` configures the existing Vercel project to install with pnpm, run `pnpm run build`, and serve `dist/` as a static Astro site. A server adapter is unnecessary for these static routes.

The previous repository used AstroPaper, an Astro Vercel adapter with Web Analytics enabled, Node.js 24 in CI, and both npm and pnpm lockfiles. The relaunch uses Cactus and a single pnpm lockfile. It does not include the previous adapter-based analytics integration.

The Vercel dashboard settings and domain assignment are managed outside this repository. Keep the existing production branch (`master`) and project/domain assignment; `relaunch` is for preparation and, if enabled in Vercel, preview deployments. Publishing to production is a later step. No production merge or deployment is part of this change.

GitHub Actions checks Astro/TypeScript, lint, formatting and the production build on pull requests. It does not publish the site.

## Theme source and license

Based on Cactus v8.3.0, upstream commit `728f1f4eeb80208398649261d7635f311cafa011`. The theme's MIT license is retained in `LICENSE`.
