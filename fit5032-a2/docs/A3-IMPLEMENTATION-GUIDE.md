# A3 implementation and deployment guide

## Included capabilities

- D.1: the existing registration, login and role-gated routes have a Firebase configuration boundary ready for replacement by Firebase Authentication.
- D.2: `functions/sendBulkEmail` is an administrator-only callable Cloud Function designed for Resend. The UI validates recipients, subject and body and reports delivery failure.
- D.3: the administrator has interactive member, resource and engagement tables with search, sorting and ten rows per page.
- D.4/E.1: Firebase Hosting and Functions configuration is present.
- E.2: the home page can search a selected workshop location and generate a transit route using the browser map provider. Supply a Mapbox token before replacing this service with an embedded production Mapbox map.
- E.3: forms have labels, validation feedback, keyboard controls, visible focus indicators and live status messages.
- E.4: each interactive report exports CSV and supports print-to-PDF.
- F.1: constrained workshop booking, bulk email, engagement analytics, and the admin dashboard are implemented.

## Production setup

1. Copy `.env.example` to `.env.local` and enter the Firebase web app details and a Mapbox token. Do not commit `.env.local`.
2. Create Firebase Authentication email/password sign-in, Firestore, Storage and Hosting in the selected Firebase project. Configure an administrator custom claim for the coordinator account.
3. In `functions`, install dependencies, then configure `RESEND_API_KEY` with `firebase functions:secrets:set RESEND_API_KEY`. Replace `YOUR_VERIFIED_DOMAIN` in `functions/index.js` with a verified Resend sending domain.
4. Deploy rules and functions with `firebase deploy --only firestore:rules,storage,functions`, then publish with `npm run build` and `firebase deploy --only hosting`.
5. Replace the local demonstration stores in `src/services/auth.js`, `libraryStore.js`, `bookingStore.js` and `engagementStore.js` with Firestore listeners before final submission. This repository keeps their interfaces deliberately small to make that migration direct.

## Submission evidence

Capture a deployed-app screenshot and a brief video sequence for: Firebase login, both interactive tables, email validation and successful delivery, map search and transit route, keyboard navigation, CSV/PDF exports, capacity rejection, booking confirmation, analytics dashboard and all four innovation features. Record the deployed URL and commit history in the A3 template.
