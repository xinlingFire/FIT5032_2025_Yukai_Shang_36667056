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

The application uses Firebase Authentication and Firestore when the Firebase project is enabled and configured. It retains a browser cache fallback so the interface remains demonstrable while an external service is unavailable. Vercel hosts the Vue application and its `/api/sendBulkEmail` serverless endpoint.

For the deployed email workflow, add `FIREBASE_API_KEY`, `ADMIN_EMAILS`, `RESEND_API_KEY`, and `RESEND_FROM_EMAIL` in **Vercel Project Settings → Environment Variables**. The API verifies the sender's Firebase ID token and permits only addresses in `ADMIN_EMAILS`. Use a verified Resend domain for delivery to arbitrary recipients; `onboarding@resend.dev` is suitable only for Resend's onboarding/testing limitations.

## Included functionality

- Responsive health resource hub with a community-health hero image
- Mixed catalogue of health books, practical guides and community workshops
- Lucide book, document and presentation icons that distinguish each resource type
- Keyword search by resource name or provider, plus resource-type and health-topic filtering
- Workshop cards and detail views with date, time and venue information, date-capacity booking and booking management
- Firebase-backed catalogue, booking and engagement data with a browser-cache fallback
- General health-information and emergency `000` safety notices on the home and resource-detail pages
- Resource suggestion form with name, email and text-length validation
- Registration, login, logout and persistent Firebase session when Firebase Email/Password is enabled
- Community member and administrator roles with route guards and Firestore-backed profiles
- Administrator creation, editing and deletion of books, guides and workshops
- Community member saved resources, individual 1-5 usefulness ratings and aggregate feedback scores, synchronised to Firestore when available
- Accessible resources and engagement tables with filtering, sorting, 10-row pagination, CSV/PDF export, charts and analytics
- Administrator bulk-email composition with optional attachment, delivery feedback and Resend server-side integration
- Mapbox place search and route planning when `VITE_MAPBOX_TOKEN` is configured, with external-map fallback
- Not-found and access-denied pages

## Scope and safety

The app provides general health-resource navigation only. It does not diagnose conditions, provide clinical advice, process payments, book appointments or handle emergencies. For urgent help in Australia, call `000`.

Firebase security rules prevent client-side role escalation. The deployment remains an assessment application, so it must not be used to collect or act on sensitive health information.

## Demo service coordinator account

- Email: `admin@openshelf.local`
- Password: `AdminPass2026!`

## Local data upgrade

When the app first loads this version, the older catalogue is upgraded to the mixed resource directory. The legacy Local Storage key is intentionally retained to avoid changing the existing data-flow implementation.

## Visual acknowledgement

The homepage community-workshop image is sourced from Unsplash for this assessment prototype. Any final submission should retain appropriate attribution and declare all external or AI-assisted content in the assessment acknowledgement.
