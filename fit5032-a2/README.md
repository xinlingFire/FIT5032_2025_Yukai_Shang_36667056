# Open Shelf Health Connect

Open Shelf Health Connect is a responsive Vue 3 health-resource hub for newly arrived migrant communities in Australia. It helps community members browse plain-language starting points, save useful resources and share feedback. It provides general information only and is not a medical advice, diagnosis or emergency-response service.

## Run locally

```sh
npm install
npm run dev
```

For a production check:

```sh
npm run build
```

## Included functionality

- Responsive health resource hub with a community-health hero image
- Keyword search by resource name or provider, plus health-topic filtering
- Browser Local Storage initialisation from eight health-resource records
- General health-information and emergency `000` safety notices on the home and resource-detail pages
- Resource suggestion form with name, email and text-length validation
- Registration, login, logout and persistent local browser session
- Community member and service coordinator roles with an administrator-only management area
- Service coordinator resource creation, editing and deletion with Local Storage persistence
- Community member saved resources, individual 1-5 usefulness ratings and aggregate feedback scores
- Not-found and access-denied pages

## Scope and safety

The app provides general health-resource navigation only. It does not diagnose conditions, provide clinical advice, process payments, book appointments or handle emergencies. For urgent help in Australia, call `000`.

The authentication and role checks are front-end demonstrations backed by browser Local Storage. They are suitable for the assessment prototype only, not for a real health service.

## Demo service coordinator account

- Email: `admin@openshelf.local`
- Password: `AdminPass2026!`

## Reset local data

To load the health-resource seed data after using an older catalogue version, remove the `open-shelf-library-books` entry from the browser's Local Storage and reload the application. The legacy key is intentionally retained to avoid changing the existing data-flow implementation.

## Visual acknowledgement

The homepage community-workshop image is sourced from Unsplash for this assessment prototype. Any final submission should retain appropriate attribution and declare all external or AI-assisted content in the assessment acknowledgement.
