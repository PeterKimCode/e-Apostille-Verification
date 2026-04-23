# e-Apostille Verification

This repository contains a lightweight React + Vite demo that reproduces the look-and-feel and basic verification flow of an e-Apostille registry UI. It is a functional demo and does not connect to the official backend.

## Quick start

```bash
npm install
npm run dev
```

Open `http://localhost:5173`.

## Route mapping

- The verification page URL now uses `pageUrl`.
- Example:
  `https://e-registryapostillegov.ph/#/verify/publicregistry.apostille.gov.phQhgdhfeTh98OKOJssdsQ26e-0016922`
- Each record in [src/data/mockData.json](src/data/mockData.json) keeps both:
  - `serialNumber`: shown in the details card
  - `pageUrl`: used by the router and public page address
- The app resolves `pageUrl` to the matching record, then loads that record's `pdfUrl`.

Example record:

```json
{
  "serialNumber": "26e-0013558856",
  "signedBy": "Rogelio T. Galera, Jr",
  "capacity": "Regional Director",
  "sealOf": "Commission on Higher Education",
  "verifiedDate": "2026-04-21",
  "pdfUrl": "/eApostille-26e-0013558856.pdf",
  "pageUrl": "publicregistry.apostille.gov.phQhgdhfeTh98OKOJssdsQ26e-0016922"
}
```

## Preview toolbar

- The preview now uses an in-app PDF viewer built with `pdfjs-dist`.
- A custom toolbar is shown above the document preview.
- Supported controls:
  - previous page / next page
  - zoom out / zoom in
  - rotate
  - reset view
  - download
  - print

This avoids the older browser-native iframe behavior that could show a blank preview while downloading the PDF instead.

## How to add or replace a PDF

1. Put the PDF file in [public](public).
2. Add or update the record in [src/data/mockData.json](src/data/mockData.json).
3. Set:
   - `serialNumber`: display value for the details panel
   - `pageUrl`: public route slug
   - `pdfUrl`: exact file path under `public`, starting with `/`

## Main files

- [src/data/mockData.json](src/data/mockData.json): verification records
- [src/data/records.js](src/data/records.js): route-to-record lookup helpers
- [src/components/PdfPreview.jsx](src/components/PdfPreview.jsx): PDF preview and toolbar
- [src/components/LeftCard.jsx](src/components/LeftCard.jsx): verification details panel
- [src/App.jsx](src/App.jsx): page shell and header
- [src/main.jsx](src/main.jsx): router setup
- [src/styles.css](src/styles.css): styling
- [public/404.html](public/404.html): GitHub Pages SPA redirect

## GitHub Pages

- Push to `main`.
- GitHub Actions builds and deploys automatically.
- The custom domain in [public/CNAME](public/CNAME) is `e-registryapostillegov.ph`.

## Disclaimer

This is a demo implementation and not an official copy of any government site. Do not use it as an authoritative source.
