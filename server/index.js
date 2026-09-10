import express from 'express';
import cors from 'cors';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

const DIST_DIR = path.resolve(__dirname, '..', 'dist');

app.use(cors());
app.use(express.json());

// Shared security + isolation headers so the MediaPipe WASM pipeline can run
// when served from this server (COOP/COEP enable SharedArrayBuffer where used).
app.use((_req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'no-referrer');
  next();
});

const startedAt = Date.now();

// ─── API Routes ────────────────────────────────────────────────────────────

// Health check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    name: 'clapcam-api',
    version: process.env.npm_package_version || '0.0.0',
    uptimeMs: Date.now() - startedAt,
    time: new Date().toISOString(),
  });
});

// Runtime capabilities report (what the browser bundle needs to know)
app.get('/api/system-info', (_req, res) => {
  res.json({
    app: 'ClapCam AI',
    description: 'On-device computer vision + acoustic AI engine. All processing stays in the browser.',
    privacy: 'air-gapped',
    mediaPipe: {
      wasmCdn: 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm',
      delegate: 'GPU',
    },
    requirements: {
      https: 'not-required-on-localhost',
      secureContext: true,
    },
  });
});

// ─── Static Frontend (SPA) ─────────────────────────────────────────────────

if (!fs.existsSync(DIST_DIR)) {
  console.warn(
    `[clapcam-server] dist/ not found at ${DIST_DIR}. ` +
      'Run `npm run build` first, or use `npm run dev` for the Vite dev server.',
  );
}

app.use(
  express.static(DIST_DIR, {
    index: 'index.html',
    maxAge: '1h',
    setHeaders: (res, filePath) => {
      // Never cache the HTML shell so new deploys always resolve
      if (filePath.endsWith('index.html')) {
        res.setHeader('Cache-Control', 'no-cache');
      }
    },
  }),
);

// SPA fallback: any non-API GET returns the app shell (React Router handles it)
app.use((req, res, next) => {
  if (req.method !== 'GET' || req.path.startsWith('/api/')) {
    return next();
  }
  res.sendFile(path.join(DIST_DIR, 'index.html'));
});

// ─── Error handler ─────────────────────────────────────────────────────────

app.use((err, _req, res, _next) => {
  console.error('[clapcam-server] Unhandled error:', err);
  res.status(500).json({ status: 'error', message: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`[clapcam-server] ClapCam AI web server running:`);
  console.log(`  ➜ Local:   http://localhost:${PORT}/`);
  console.log(`  ➜ API:     http://localhost:${PORT}/api/health`);
  console.log(`  ➜ Serving: ${DIST_DIR}`);
});