# Open Shelf Health Connect

Open Shelf Health Connect is a responsive Vue 3 health-resource hub for newly arrived migrant communities in Australia. It brings together health books, practical guides and community workshops that members can browse, save and rate. It provides general information only and is not a medical advice, diagnosis or emergency-response service.

## Run locally

```sh
npm install
npm run dev
```

For a production check:

```sh
npm run build
```

## Deploy to Vercel

Import this repository in Vercel with `Vite` as the framework preset. Use `npm run build` as the build command and `dist` as the output directory. The included `vercel.json` keeps Vue Router history routes working after a browser refresh.

The current prototype stores authentication, catalogue, bookings and engagement data in the browser. Vercel hosts the frontend but does not replace that storage. For production persistence, connect these service modules to Supabase or another database before submission.

## Included functionality

- Responsive health resource hub with a community-health hero image
- Mixed catalogue of health books, practical guides and community workshops
- Lucide book, document and presentation icons that distinguish each resource type
- Keyword search by resource name or provider, plus resource-type and health-topic filtering
- Workshop cards and detail views with date, time and venue information; no booking flow
- Browser Local Storage initialisation and upgrade from earlier seed data
- General health-information and emergency `000` safety notices on the home and resource-detail pages
- Resource suggestion form with name, email and text-length validation
- Registration, login, logout and persistent local browser session
- Community member and service coordinator roles with an administrator-only management area
- Service coordinator creation, editing and deletion of books, guides and workshops with Local Storage persistence
- Community member saved resources, individual 1-5 usefulness ratings and aggregate feedback scores
- Not-found and access-denied pages

## Scope and safety

The app provides general health-resource navigation only. It does not diagnose conditions, provide clinical advice, process payments, book appointments or handle emergencies. For urgent help in Australia, call `000`.

The authentication and role checks are front-end demonstrations backed by browser Local Storage. They are suitable for the assessment prototype only, not for a real health service.

## Demo service coordinator account

- Email: `admin@openshelf.local`
- Password: `AdminPass2026!`

## Local data upgrade

When the app first loads this version, the older catalogue is upgraded to the mixed resource directory. The legacy Local Storage key is intentionally retained to avoid changing the existing data-flow implementation.

## Visual acknowledgement

The homepage community-workshop image is sourced from Unsplash for this assessment prototype. Any final submission should retain appropriate attribution and declare all external or AI-assisted content in the assessment acknowledgement.
