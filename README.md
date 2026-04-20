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
