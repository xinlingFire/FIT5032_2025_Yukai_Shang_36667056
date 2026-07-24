# Open Shelf Library Catalogue

First-stage implementation for FIT5032 Assessment 2. The application is a responsive Vue 3 library catalogue with dynamic Local Storage-backed book data.

## Run locally

```sh
npm install
npm run dev
```

For a production check:

```sh
npm run build
```

## Included in this stage

- Responsive catalogue navigation and layout
- Book grid and book detail routes
- Title/author search and category filtering
- Browser Local Storage initialisation from seed book data
- Book recommendation form with name, email and text-length validation
- Valid book suggestions saved in browser Local Storage
- Account registration, login, logout and persistent browser session
- Authenticated account page with navigation guard
- Student and administrator account roles with an administrator-only dashboard
- Administrator-only book creation, editing and deletion with Local Storage persistence
- Not-found route

## Not included yet

- Favourites, reviews, ratings or aggregate scores

## Administrator demo account

- Email: `admin@openshelf.local`
- Password: `AdminPass2026!`

To reset the sample catalogue, remove the `open-shelf-library-books` entry from the browser's Local Storage and reload the application.
