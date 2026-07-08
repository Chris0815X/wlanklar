## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## WLANklar project source of truth

Before changing website copy, offers, prices, regions, contact logic, or tracking, read:

- `../docs/WLANKLAR_PROJECT_CONTEXT.md`
- `src/data/config.ts`
- `src/data/services.ts`
- `src/data/travel-zones.ts`
- `src/data/faq.ts`

Current core offer names:

- WLAN-Check vor Ort
- WLAN-Komplettpaket
- Stabiles Heimnetz
- Gastgeber-Check
- Gäste-WLAN Komfort
- Saisonstart-Check
- Büro-WLAN-Check
- Büro-WLAN Setup

Do not reintroduce old package names or old price levels from the legacy static site. The old `../wlanklar_site/` folder is archive/reference material only.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
