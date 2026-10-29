# Leader Academy

The project uses Next.js App Router, TypeScript, Tailwind CSS 4, and `next-intl`.
Arabic (`ar`) is the default locale; English (`en`) is also supported.

## Development

```powershell
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The locale proxy redirects
the root route to a locale-prefixed route. Use `/ar` and `/en` to verify both
foundation states directly.

## Validation

```powershell
npm run typecheck
npm run lint
npm run build
```

## Architecture

- `src/app/[locale]` contains the locale root layout and foundation route.
- `src/i18n` centralizes routing, navigation helpers, and request messages.
- `messages` contains the Arabic and English translation skeletons.
- `src/components/ui` contains the shared `Container`, `Section`, and `Button`.
- `src/app/globals.css` maps the supplied design tokens to Tailwind utilities.
- `design.md` and `public/brand/logo.webp` are the supplied brand assets.

The work is intentionally limited to Milestone 0. No site navigation, footer,
or marketing-page content has been implemented.
