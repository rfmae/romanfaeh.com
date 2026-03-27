# Roman Faeh's Personal Website

This is the source code for my personal website, built with [Astro](https://astro.build) and deployed on [Vercel](https://vercel.com).

## About

I'm Roman, a security engineer based in Switzerland. This site is my personal home on the web — a place for writing, notes, and blog posts about security, AI, LLM systems, and practical engineering.

## Project Structure

```text
├── public/                 # Static assets (favicon, OG image, generated search assets)
├── src/
│   ├── components/         # Reusable UI components
│   ├── data/
│   │   └── blog/           # Blog posts in Markdown, organized by year
│   ├── layouts/            # Shared page layouts
│   ├── pages/              # Routes and page files
│   ├── scripts/            # Client-side scripts
│   ├── styles/             # Global and typography styles
│   ├── utils/              # Utility helpers (OG image generation, etc.)
│   ├── config.ts           # Site metadata and configuration
│   ├── constants.ts        # Shared constants
│   ├── content.config.ts   # Astro content collection schema
│   └── env.d.ts            # Env typing
├── astro.config.ts         # Astro configuration
├── eslint.config.js        # Linting configuration
├── package.json            # Project scripts and dependencies
├── pnpm-lock.yaml          # Locked dependency versions
├── tsconfig.json           # TypeScript configuration
└── LICENSE                 # License for this repository
```

## Commands

| Command             | Action                                   |
| :------------------ | :--------------------------------------- |
| `pnpm install`      | Install dependencies                     |
| `pnpm dev`          | Start local dev server                   |
| `pnpm build`        | Run checks and build the production site |
| `pnpm preview`      | Preview the production build locally     |
| `pnpm sync`         | Generate Astro types                     |
| `pnpm lint`         | Run ESLint                               |
| `pnpm format`       | Format files with Prettier               |
| `pnpm format:check` | Check formatting                         |

## Content

Blog posts live in:

```text
src/data/blog/YYYY/*.md
```

The site currently includes:

- homepage
- about page
- posts index
- individual post pages
- tags
- archives
- RSS feed
- search

## Deployment

This site is deployed on Vercel.

Typical flow:

1. push changes to GitHub
2. Vercel pulls the repository
3. Vercel builds and deploys the site

## Notes

This repo started from the [AstroPaper](https://github.com/satnaing/astro-paper) theme and has been adapted into a personal site.

## License

See [LICENSE](LICENSE).
