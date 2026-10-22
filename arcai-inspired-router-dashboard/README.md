# NetworkPilot — Router-inspired dashboard starter

A responsive, dark network dashboard inspired by common router-management interfaces. This is an independent project and does not copy Arcai's branding or source code.

## Included
- Overview dashboard with sample metrics and a clearly labelled demo notice
- Device list, search, status filtering, CSV export, demo-only rename/status actions
- Illustrative traffic page
- Security checklist and router integration setup guide
- Responsive layout for desktop, tablet and phone
- Vite build for free static hosting

## Important limitation
The current app is a front-end prototype. Sample device names, IP/MAC addresses, traffic metrics and status values are illustrative only. It does **not** scan Wi-Fi, measure actual bandwidth, block devices, change router settings, or authenticate users. A public website cannot generally discover private LAN devices directly from a visitor's browser. Real control needs a supported router integration/local agent and carefully secured authentication.

## Run locally
1. Install Node.js LTS from https://nodejs.org/
2. Extract this ZIP.
3. Open the extracted folder in VS Code.
4. Open Terminal in VS Code and run:
   ```bash
   npm install
   npm run dev
   ```
5. Open the local URL Vite prints, normally `http://localhost:5173`.

To check a production build:
```bash
npm run build
npm run preview
```
The static output is generated in `dist/`.

## Free static hosting (example: GitHub + Vercel)
1. Create a new GitHub repository for this project.
2. Upload the project files (do not upload `node_modules` or `dist`).
3. Import the repository in Vercel.
4. Framework preset: Vite; Build command: `npm run build`; Output directory: `dist`.
5. Deploy. Free-plan limits and terms can change; verify them on the hosting provider.
6. The deployed site is accessible worldwide, but it will still be a demo until a secure integration is added.

## Safe next step for real router features
1. Find the exact router brand/model and firmware from the device label or official admin UI.
2. Verify whether it has an official documented local API or is supported by a reputable local management tool.
3. Run a local connector on a trusted always-on device on your home LAN. It should query only documented router interfaces and expose a narrow authenticated API.
4. Never put router admin credentials in frontend JavaScript, GitHub, or public environment variables.
5. Do not expose router administration or a local connector directly to the internet. Prefer a trusted VPN for remote access.
6. Add device blocking/bandwidth limits only if the specific router documents and supports those actions. Keep read-only mode until tested.

## Current files
- `index.html`
- `src/main.js`
- `src/style.css`
- `public/favicon.svg`
