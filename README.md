# Permaqr — QR codes that never expire

A free, beautiful QR code generator that runs **entirely in your browser**. Unlike
qrco.de, qr.io and friends, Permaqr never puts a redirect server in the middle of
your code. The real data (your URL, Wi-Fi password, contact card, etc.) is encoded
**directly** into the QR — so it keeps working forever, offline, with no account
and no "free trial" that bricks your link later.

## Why this exists

Most "free" QR generators create a *dynamic* code: the QR actually points at
`their-domain.com/abc123`, which redirects to your link. When the trial ends, that
redirect dies and your printed code is worthless unless you pay. Permaqr only makes
**static** codes — the data is in the pixels, nothing to expire.

## Features

- **12 code types** — Website/Link, Plain text, Email, Phone, SMS, Wi-Fi, Contact
  (vCard), WhatsApp, Location, Calendar event, Crypto payment, PayPal.
- **Full styling** — solid or gradient foreground, custom background (or
  transparent), six dot styles, corner frame/dot shapes, logo upload, adjustable
  quiet zone and error-correction level.
- **8 one-click presets** for instant good-looking codes.
- **Export** to PNG, SVG, JPG or WEBP at print resolution (1024px).
- **100% client-side** — no network calls, no tracking, your data never leaves the
  device.

## Tech

- [Vite](https://vite.dev/) + React + TypeScript
- [Tailwind CSS v4](https://tailwindcss.com/)
- [`qr-code-styling`](https://github.com/kozakdenys/qr-code-styling) for rendering
- [`lucide-react`](https://lucide.dev/) icons

## Develop

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production bundle in dist/
npm run preview  # preview the production build
```

## How it works

`src/qr/types.ts` defines each code type as a set of form fields plus a `build()`
function that turns the field values into the exact string to encode (e.g. a
`WIFI:T:WPA;S:...;P:...;;` payload or a vCard). `src/qr/style.ts` maps the visual
options onto `qr-code-styling`, and `src/qr/useQrCode.ts` keeps a single styled QR
instance in sync with the live data. Everything renders reactively — type a
character and the preview updates instantly.

Deploy the contents of `dist/` to any static host (Netlify, Vercel, GitHub Pages,
S3 — anything). There is no backend.
