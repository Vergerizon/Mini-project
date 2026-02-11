# DigiWallet Frontend

This folder contains a minimal React + Vite frontend scaffold for the DigiWallet backend.

Structure created:

- src/
  - components/
    - common/
  - pages/
  - services/
  - styles/
  - assets/
  - hooks/
  - utils/
- public/

Quick start

1. Install dependencies

```bash
cd Frontend
npm install
```

2. Start dev server

```bash
npm run dev
```

3. Open the URL shown by Vite (usually http://localhost:5173)

Config

- API base URL can be provided with `VITE_API_URL` environment variable. Example (Windows PowerShell):

```powershell
$Env:VITE_API_URL = 'http://localhost:3000'
npm run dev
```

Notes

- This is a starter scaffold. Add components, routing, state-management, and tests as needed.
- Backend lives in the `Backend/` folder at the repo root.
