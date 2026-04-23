# e-Apostille Verification

This repository contains a lightweight React + Vite demo that reproduces the look-and-feel and basic verification flow of an e-Apostille registry UI. It is a functional demo and does not connect to the official backend.

## Quick start

```bash
npm install
npm run dev
```

Open `http://localhost:5173`.

## How routing works

- The route is based on `serialNumber`, not on the PDF filename.
- Example URL:
  `https://e-registryapostillegov.ph/#/verify/26e-0016922`
- React Router reads `26e-0016922` from the URL.
- The app then finds the matching record in [src/data/mockData.json](src/data/mockData.json).
- That record's `pdfUrl` points to the actual PDF file inside [public](public).

Because of that mapping, the expected public address is the serial-number route above, not a route that contains the full PDF filename.

## Why the preview was blank

- The old preview used a browser-native `<iframe>` PDF viewer.
- In some browser setups, the PDF URL is treated as a downloadable file instead of an embeddable preview.
- When that happens, the file downloads and the preview area stays empty.

The app now renders PDFs with `pdfjs-dist` inside the page, so preview rendering no longer depends on the browser's built-in PDF iframe behavior.

## How to add or replace a PDF

1. Put the PDF file in [public](public).
2. Add or update the record in [src/data/mockData.json](src/data/mockData.json).
3. Set:
   - `serialNumber`: the value used in the URL
   - `pdfUrl`: the exact public file path beginning with `/`

Example:

```json
{
  "serialNumber": "26e-0016922",
  "signedBy": "Rogelio T. Galera, Jr",
  "capacity": "Regional Director",
  "sealOf": "Commission on Higher Education",
  "verifiedDate": "2026-04-22",
  "pdfUrl": "/publicregistry.apostille.gov.phQhgdhfeTh98OKOJssdsQ26e-0016922.pdf"
}
```

## Main files

- [src/data/mockData.json](src/data/mockData.json): verification records and PDF mapping
- [src/components/PdfPreview.jsx](src/components/PdfPreview.jsx): in-app PDF preview renderer
- [src/components/LeftCard.jsx](src/components/LeftCard.jsx): verification details panel
- [src/App.jsx](src/App.jsx): page shell and header
- [src/styles.css](src/styles.css): styling
- [src/main.jsx](src/main.jsx): hash router setup
- [public/404.html](public/404.html): GitHub Pages deep-link redirect for SPA routes

## GitHub Pages

- Push to `main`.
- GitHub Actions builds and deploys automatically.
- The custom domain in [public/CNAME](public/CNAME) is `e-registryapostillegov.ph`.

## Disclaimer

This is a demo implementation and not an official copy of any government site. Do not use it as an authoritative source.
