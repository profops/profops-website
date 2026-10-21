# ProfOps Coming Soon deployment

- `src/pages/index.astro` is the public Coming Soon page.
- The previous homepage is saved at `src/pages/preview.astro` for local review.
- Other draft routes are still accessible if someone knows their URL. To keep all unfinished pages private, remove or relocate `preview.astro`, `about.astro`, `insights.astro`, `labs.astro`, and `ai-ops.astro` from `src/pages/` before deploying. For now, do not link to them.
- Run `npm install`, `npm run build`, and `npm run dev` locally.
- Cloudflare Pages: framework Astro, build `npm run build`, output `dist`, production branch `main`.
- In Cloudflare Pages > Custom domains, add `profops.dev` after the first successful deploy.
