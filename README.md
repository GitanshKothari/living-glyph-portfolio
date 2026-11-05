# Living Glyph

A static-first portfolio built with React 19, TypeScript, Vite and Tailwind CSS 4. Accessible command and navigation dialogs use Radix primitives (the same foundation used by shadcn). The original checkout was plain HTML/CSS/JavaScript, with no framework to preserve.

## Local workflow

Use the existing checkout; a separate worktree is not required.

```sh
npm ci
npm run dev
```

Production review (including prerendered HTML):

```sh
npm run build
npm run preview -- --port 4173
```

The preview serves every generated route directly. Deploy `dist/` with directory-index routing, and serve `dist/404.html` for unknown paths. No production deployment has been performed.

```sh
npm test
```

Tests expect the production preview on port 4173. Chromium is configured at `/usr/bin/chromium` in this cloud workspace; change `executablePath` in `playwright.config.ts` for another machine, or use Playwright's installed Chromium.

## Structure

- `src/content.ts`: structured case studies, experience, routes and curated search index.
- `src/Glyph.tsx`: bounded canvas renderer derived from the approved prototype's quadrant mask. Layouts are cached, DPR is capped at 2, animation stops when settled/offscreen, and reduced motion keeps the mark static.
- `src/App.tsx`: shared shell, native-link routing enhancement, pages, search and copy interaction.
- `src/styles.css`: dark visual system, Tailwind utilities and responsive layouts.
- `scripts/prerender.tsx`: produces HTML for all eight public routes plus a 404, and a sitemap. Content remains readable with JavaScript disabled.
- `tests/portfolio.spec.ts`: browser navigation, keyboard and clipboard behavior, Back scroll/focus restoration, responsive overflow, static content and automated WCAG checks.

## Verified locally

Production compilation/type checking, desktop/mobile Chromium, 320/390/768/1440px overflow checks across all pages, reduced motion, direct routes without JavaScript, search, copied email, and browser Back behavior. Automated axe checks cover primary pages and the open command dialog. This is not a claim of full accessibility certification, field performance, or iOS/Android device testing.

## Content provenance and release follow-up

The controlling visual reference is the uploaded `living-glyph.html`; content and scope follow `Living_Glyph_Design_Spec.md`, with the user's implementation authorization superseding its planning-only wording. No rejected light design board or synthetic project imagery was used.

Authentic media and résumé were recovered from `GitanshKothari/new-personal-portfolio` at `83480b2836ca3f2a7859b0e326c46e7c69afd986`:

| Local asset                                | Original source                                                                                        |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------------ |
| `public/media/perception.webp`             | `public/projects/yolo-seg.jpg`                                                                         |
| `public/media/scholarspace.webp`           | `public/projects/scholarspaceai.png`                                                                   |
| `public/media/architecture.webp`           | `public/blog/lenet/architecture-overview.webp` (LeNet reference diagram, not a generated model output) |
| `public/resume/Gitansh_Kothari_Resume.pdf` | `public/resume/Gitansh_Kothari_Resume.pdf`                                                             |

Images are resized WebP derivatives. No image is presented as a newly generated experimental result. Geist Latin is self-hosted from `@fontsource-variable/geist` with its OFL license retained under `public/fonts`.

Project sources inspected:

- `GitanshKothari/yolov5_segmentation` at `d81cab0278ec00ebcb70d768c9481aaf99d4b532`.
- `hitarthdesai/scholar-space-ai` at `b3c5e04786e6c60a58bbcd540e4f541f883a94d9`.
- `GitanshKothari/DeepReplication` at `d272ec45ce1d134c9b7a119199d125d596eb7ae6`. Transformer config confirms OPUS Books English-to-Italian; CNN, Transformer, DDPM, StableDiffusion and LLaMA2 source directories exist. Presence does not establish training or benchmark completeness.

Remaining release checks:

- The live Vercel site is blocked by this workspace's network policy. Its current project slugs could not be confirmed against the recovered older source. Confirm the deployed URLs and add redirects before replacing production. Current routes are `/projects/multi-task-driving-perception`, `/projects/scholarspace-ai`, and `/projects/deepreplication`.
- The recovered résumé predates the current UCSD profile. It is honestly labeled as the source version; replace it with the verified current PDF before release. The specification's `/Gitansh_Kothari_Resume_AI.pdf` was not available.
- The recovered sources contain a product screenshot but no ScholarSpace demo video, full gallery, or separate low-light perception output. Those are intentionally omitted pending authentic assets. No fabricated video or result layer is supplied.
- Reported metrics and current education are carried from the supplied specification; experiments were not rerun. ScholarSpace measurement boundaries and individual contribution details still need owner verification before release.
- Physical mobile-device and repeated throttled performance testing remain release tasks. No production site, remote branch, or hosting settings were changed.
