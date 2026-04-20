# e-Apostille Verification (Demo)

This repository contains a lightweight React + Vite demo that reproduces the look-and-feel and basic verification flow of an e-Apostille registry UI. It is a functional demo and does not connect to the official backend.

Quick start

1. Install dependencies

```bash
npm install
```

2. Run dev server

```bash
npm run dev
```

3. Open http://localhost:5173

Pushing to GitHub

- I prepared a local git commit in this workspace. To push to your repository at https://github.com/PeterKimCode/e-Apostille-Verification.git you can either:
  - Add a remote and push from your machine (recommended), or
  - Provide a GitHub personal access token so I can push from this environment.

If you want me to push, share a PAT with `repo` permissions and I will push to `main`.

GitHub Pages (automatic)

- This repository now includes a GitHub Actions workflow that builds the Vite app and deploys the `dist` folder to the `gh-pages` branch on every push to `main`.
- After you push to `main`, the action will run and publish the site at:
  `https://<your-username>.github.io/e-Apostille-Verification/`
- Notes:
  - The Vite config sets a production `base` so assets load correctly on GitHub Pages.
  - You don't need a PAT for the action — the workflow uses the built-in `GITHUB_TOKEN` to publish.
  - If you prefer manual deployment, build locally with `npm run build` and copy `dist/` to your Pages branch.

Disclaimer

This is a demo implementation and not an official copy of any government site. Do not use it as an authoritative source.

---

Additional notes (where to find & how to edit)

- **PDF file used by the preview**: place or replace the file at [public/register.pdf](public/register.pdf). During build Vite copies `public/` to the root of `dist/`, so the PDF will be available at `/register.pdf` on the published site.
  - To update the PDF:
    1. Replace `public/register.pdf` with your new PDF file (keep the same filename or update the iframe src in [src/components/PdfPreview.jsx](src/components/PdfPreview.jsx)).
    2. Commit and push to `main`.
    3. GitHub Actions will rebuild and redeploy automatically (or run locally: `npm run build`).

- **Logo / header**: the header currently uses a simple placeholder in [src/App.jsx](src/App.jsx). To use an image:
  - Add your image to `public/logo.png` (or another name).
  - Replace the placeholder markup in `src/App.jsx` (the element with class `logo-placeholder`) with:

```jsx
<img src={import.meta.env.BASE_URL + 'logo.png'} alt="Logo" className="logo-image" />
```

  - Add CSS in [src/styles.css](src/styles.css) to size the image (e.g., `.logo-image { width:48px; height:48px; border-radius:50%; }`).

- **Where the main UI lives**:
  - Left verification card: [src/components/LeftCard.jsx](src/components/LeftCard.jsx)
  - PDF preview: [src/components/PdfPreview.jsx](src/components/PdfPreview.jsx)
  - Global styles: [src/styles.css](src/styles.css)
  - App entry: [src/App.jsx](src/App.jsx)
  - Vite config (base config for GH Pages): [vite.config.js](vite.config.js)
  - GH Pages workflow: [.github/workflows/gh-pages.yml](.github/workflows/gh-pages.yml)

- **Local development**:
  - Install and run:

```bash
npm install
npm run dev
# Open http://localhost:5173
```

- **Build & publish locally**:

```bash
npm run build
# serve the dist or copy contents of dist/ to your Pages branch
```

- **Updating site on GitHub Pages**:
  - Push to `main`. The workflow will build and publish to the `gh-pages` branch automatically.
  - Check Actions → the `Deploy to GitHub Pages` workflow for build logs.

- **Security recommendations**:
  - Do not paste Personal Access Tokens (PATs) into chats. If you created a PAT earlier for this repo, revoke it and create a fine-grained token or rely on Actions' `GITHUB_TOKEN` for deployment.

If you'd like, I can also add a small script and `package.json` `deploy` command to trigger the GH Pages deploy locally, or switch the logo placeholder to load an example image automatically—tell me which you'd prefer.
