# ClapCam AI

Real-time AI "invisibility cloak" that runs entirely in your browser:

- **Clap detection** (Web Audio API, 2–4 kHz bandpass) toggles visibility
- **Person segmentation** (MediaPipe Selfie Segmentation, GPU delegate) composites your face/person
  out of the live feed and replaces it with a captured clean background plate
- **Air-gapped**: zero server uploads; all video/audio processing stays on-device

## Tech Stack

- Vite 8 + React 19 + TypeScript
- Tailwind CSS 4 (v3-style theme config loaded via `@config` in `src/index.css`)
- Zustand (global state), Framer Motion, lucide-react
- Express (static hosting + small JSON API for the production build)
- `@mediapipe/tasks-vision` for selfie segmentation

## Getting Started

```bash
npm install
npm run dev          # Vite dev server → http://localhost:5173
```

The dev server proxies `/api/*` to the Express API on port 3001.

## Production (Express server)

```bash
npm run build        # typecheck + build frontend into dist/
npm run start        # Express serves dist/ + API → http://localhost:3001
```

Or in one shot:

```bash
npm run serve        # build + start
```

### API endpoints

| Endpoint                | Description                          |
| ----------------------- | ------------------------------------ |
| `GET /api/health`       | Liveness check (status, uptime)      |
| `GET /api/system-info`  | Runtime capabilities / privacy info  |

The Express server sets `Cross-Origin-Opener-Policy: same-origin` and
`Cross-Origin-Embedder-Policy: require-corp` headers so the WASM vision pipeline
works when served from the production server.

## Scripts

| Script           | Purpose                              |
| ---------------- | ------------------------------------ |
| `npm run dev`    | Vite dev server (HMR)                |
| `npm run build`  | `tsc -b` + `vite build`              |
| `npm run start`  | Run Express production server        |
| `npm run serve`  | `build` then `start`                 |
| `npm run lint`   | oxlint                               |
| `npm run preview`| Vite preview of the build            |