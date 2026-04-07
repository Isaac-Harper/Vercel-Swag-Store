# Monogram Starter Kit - Next.js Edition

_The Monogram client boilerplate._

## Setup.

> `next-starter-kit` is a GitHub template repository. That means you can use this as a template to create new repositories (without losing your baggage).

1. Create a new repository using GitHub (click the + and New Repository)
2. Select `next-starter-kit` as the template to create it from
3. Type a shortened, lowercase, kebab-case repository name for your new repository. For example, "Sample Company" could be called `sample-co`. Use this everywhere.

### Package Settings

Update _(at least)_ these fields in `package.json`:

- `name` _(e.g. `sample-co`)_
- `description`
- `repository`
- `bugs`
- `contributors`

### CMS

If a CMS is used, use its specific branch. For example, for Prismic, use the `prismic` branch.

## Install.

- `pnpm install`

## Develop.

1. Run `pnpm dev`
2. Visit the dev server at [`localhost:3000`](http://localhost:3000)

## Style guide

https://nexus.monogram.dev

## Deploy & Host on Vercel

Import project in [Vercel](https://vercel.com/new).

1. Connect your GitHub account to Vercel
2. Select the GitHub repo
3. Deploy!

## Testing

[Playwright](https://playwright.dev/) is being used for E2E and API endpoints testing
[Testing Library](https://testing-library.com/) is being used for unit tests

In order to set up the playwright tests use the following command: `pnpm test:setup`

To run E2E tests the following command has to be run: `pnpm test:e2e`
To run API tests the following command has to be run: `pnpm test:api`
To run Unit tests the following command has to be run: `pnpm test:unit`
