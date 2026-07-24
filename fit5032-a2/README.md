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
- Not-found route

## Not included yet

- Account registration, login or logout
- Student and administrator roles
- Account, login and book management forms
- Favourites, reviews, ratings or aggregate scores

To reset the sample catalogue, remove the `open-shelf-library-books` entry from the browser's Local Storage and reload the application.
