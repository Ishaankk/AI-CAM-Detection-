# AI Camera: web interface (React)

The frontend for the AI Camera. Pages: **Live**, **Events**, **People** (face recognition), **System**, **Settings**,
plus sign-in. Built with React 19 + Vite, plain CSS, no UI framework. Icons: Lucide. Fonts are bundled, so it
works with no internet.

The backend (Go API server + Python vision worker + MQTT) is specified in `docs/BACKEND.md`.

## Run it with no backend (mock mode)

Needs Node.js 20.19 or newer (Mac or Windows: nodejs.org, LTS version).

```
npm install
npm run mock
```

Open http://localhost:5173 and sign in as **admin** / **demo-password**.

Mock mode fakes the whole backend in the browser: a moving camera picture with boxes, detections every few
seconds, known and unknown people, 24 h of past events, enrolment, and system charts. The **Mock data → Simulate**
button at the bottom lets you trigger a detection, a tamper alert, the camera going offline, or a 12 s Wi-Fi drop,
so every error state can be reviewed without hardware.

## Run it against the real backend

```
npm run dev                         # proxies /api and /media to http://localhost:8000
BACKEND_URL=http://raspberrypi.local:8000 npm run dev      # or put BACKEND_URL in .env.local
```

## Build for the Pi

```
npm run build
```

Copy `dist/` to the Pi; the Go server serves it (or embeds it with `go:embed`). Nothing else is needed on the Pi.

## Layout

| Path | What it is |
|---|---|
| `src/api/client.js` | Every call to the real backend, matching the backend spec |
| `src/api/mock.js` | In-browser fake backend with the same functions |
| `src/state/AuthContext.jsx` | Sign-in state, redirects to `/login` |
| `src/state/LiveContext.jsx` | The live connection: status, alerts, 5 s stale warning, reconnect, confirmed controls |
| `src/components/` | Layout (menu, status pills, toasts), controls, charts, photo viewer |
| `src/pages/` | One file per page |
| `src/styles/app.css` | All styling; colours are tokens at the top (light + dark) |

## Adding a page

1. Create `src/pages/MyPage.jsx`.
2. Add a route in `src/App.jsx`: `<Route path="my-page" element={<MyPage />} />`.
3. Add it to `NAV` in `src/components/Layout.jsx`: `{ to: "/my-page", label: "My page", icon: SomeIcon }`.

Live data is available on any page through `useLive()`.

## Requirements covered

| ID | Where |
|---|---|
| F1 live video with boxes | `pages/Live.jsx` (`/api/stream`) |
| F2 latest detection | Live page, with the person's name when recognised |
| F3 history with thumbnails | Live page (last 6), Events page (all, filters, viewer) |
| F4 status bar | `Layout.jsx` pills: online, alerts on/off, °C, fps, low storage |
| F5 detection and tamper alerts | Banner on Live; toasts and tab title on every page; optional sound |
| F6 alerts on/off | Waits for the camera to confirm before changing |
| F7 sensitivity | Slider; threshold = 1 − sensitivity |
| F8 snapshot download | Live page, key `S` |
| F9 stale warning | Overlay after 5 s with no data |
| F10 auto-reconnect | Reconnects after 6 s of silence, backoff capped at 8 s |
| Face recognition | People page (add with photos or camera, consent required, delete), Settings toggles |
