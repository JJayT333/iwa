# Into Action Group — app

A static Progressive Web App (PWA). Plain HTML, CSS, and JavaScript — no backend,
no build step, no subscription. It installs to a phone home screen, runs
full-screen like a native app, and works offline for everything that lives in
the app. Only outbound links (Zoom, aa.org) need a connection.

> **No copyrighted material.** The Steps, Traditions, Preamble, prayers, the
> Daily Reflection and the books are **links to aa.org** or empty slots you can
> fill with your group's own wording — not reproduced text. Please keep it that way.

---

## ✏️ How to edit (the only file you touch: `js/content.js`)

Open **`js/content.js`** and change the value between the quotes. Save, re-upload
the file, and you're done. Common edits:

| Want to change… | Edit this |
| --- | --- |
| **Zoom link** | `LINKS.zoom` near the top |
| **Donation links** | `LINKS.squareDonate`, `LINKS.zelleEmail` |
| **Home "live / next meeting" times** | `home.meeting.times` (also `tzLabel`, `windowMins`) |
| **Home background image** | `home.background` (a file in `assets/`) |
| **Sunrise behavior** | `home.sunrise` — `"always"` (full rise every open) or `"live"` (tracks the clock) |
| **When the sun starts rising** | `home.meeting.riseMins` (used when `sunrise: "live"`) |
| **Home reflection line** | `home.reflection.line` |
| **Meeting times** (Meetings page) | the `meetings` section → `schedule` → `rows` |
| **Address** | the `meetings` section → `address` |
| **A prayer's words** | the `prayers` section → set `body: "..."` (or `href:` to link out) |
| **The meeting script** | the `meeting-script` section → paste into each part's `body` |
| **A PDF document** | add it to `assets/docs/`, then add a `pdf` block in `content.js` |
| **Announcements** (weekly/monthly) | **a Google Sheet** — see [Updating announcements](#-updating-announcements-google-sheet). No code edit needed. |
| **The share link** (after deploying) | `META.shareUrl` |

Each section is a list of **blocks**. The comment block at the top of
`content.js` lists every block type and what it does. To add a tappable link
row anywhere, add an item to a `links` block:

```js
{ label: "My Recording", sublabel: "Optional second line",
  href: "https://example.com", external: true }
```

> **You never need to edit `js/app.js` or `css/styles.css`** — those hold the
> logic and the design.

### After you change a file
Every deploy should bump the cache version so installed home-screen apps pick
up the new files on their next open. Run the release helper with the next
number (it edits `CACHE_VERSION` in `sw.js` and the `?v=` URLs in `index.html`
and `sw.js`, checks syntax, stages the site, and writes a zip):

```bash
scripts/release.sh 29
```

Add `--deploy` to publish straight to Netlify production (needs the Netlify CLI
and a linked site). Or drag the zip from `output/releases/` onto Netlify.

How updates reach phones: `sw.js`, `index.html`, and the manifest are served
with `Cache-Control: no-cache` (see `_headers`). The app checks for a new
worker every time it is opened or resumed; a new worker installs, takes over
immediately, deletes old caches, and the page reloads once. Page, CSS, and
JavaScript are network-first with an offline fallback; images, fonts, and icons
are cache-first with a background refresh.

---

## 📣 Updating announcements (Google Sheet)

Announcements are the one thing you'll change every week/month, so they live in a
**Google Sheet** — anyone you trust can update them from a phone or laptop, with
no code and no re-uploading. Changes appear in the app on the next open.

### One-time setup
1. Create a Google Sheet. Put this **header row** in row 1 (order doesn't matter,
   but spelling does):

   | Date | Title | Body | Show From | Show Until |
   |------|-------|------|-----------|-----------|

2. **Share it read-only:** top-right **Share → General access → "Anyone with the
   link" → Viewer.**
3. Copy the **sheet ID** from the address bar — it's the long code between
   `/d/` and `/edit`:
   `https://docs.google.com/spreadsheets/d/`**`1A2b3C4d...`**`/edit`
4. Paste it into `js/content.js` → `announcements.googleSheetId`. If your tab
   isn't named `Announcements`, also set `announcements.sheetName`.

### Adding / changing announcements (anytime)
Just add a row:

| Date | Title | Body | Show From | Show Until |
|------|-------|------|-----------|-----------|
| Sat, Jun 27 | Group Anniversary | Cake & fellowship after the meeting | 2026-06-20 | 2026-06-28 |
| Ongoing | Birthday Saturday | 1st Saturday of the month | | |

- **Date** is just a label shown in gold (write it however you like).
- **Body** is optional.
- **Show From / Show Until** are optional. Use `YYYY-MM-DD`. The item only shows
  between those dates, then disappears on its own — so old notices clean
  themselves up. Leave them blank for an always-on item.
- Top row shows at the top of the list. Blank rows are ignored.

The app caches the latest list, so it still shows the last-seen announcements
**offline**. If the sheet is empty or unreachable, it falls back to the small
`announcements.fallback` list in `content.js`.

---

## 🎨 Design notes
- **Navy** `#0B1E36` chrome, **gold** `#E0A93C` accent, white cards on a soft
  off-white background. All colors are CSS variables at the top of
  `css/styles.css` if you ever want to tweak them.
- The home screen is the **"First Light" dawn view**. On open it plays a sunrise:
  it starts in the pre-dawn dark with the background image (`home.background`)
  showing, then a pure-CSS **sun rises, grows and blazes up** while the image
  **dissolves completely away** — the visual heart of the screen. Over it sit the
  group name (large), a live meeting status (**"Live"** during a meeting, else the
  next meeting time), the **Join the Zoom now** button, and today's reflection.
  - `home.sunrise: "always"` plays the full rise on every open (default).
    `"live"` instead makes the sun's height track the real clock — low in the
    pre-dawn, fully ablaze by meeting time.
  - The sun, rays, glow and the image's dissolve are all driven by CSS variables
    set in `js/app.js` (`startDawn`); the look lives in `css/styles.css`
    (`.dawn*`, `.sun*`). Respects “reduce motion”.
- **Readings open the real aa.org page in the phone's in-app browser**, which has
  its own back/Done button to return to the app — aa.org blocks being embedded
  directly, so this is the way to show its genuine pages. No copyrighted AA text is
  copied into the app.
- Headings use the **Fraunces** display font when online, falling back to Georgia
  offline so the app always looks right.

---

## 📁 Files

```
into-action/
├── index.html              ← app shell (rarely touched)
├── css/styles.css          ← all design
├── js/
│   ├── content.js          ← ★ EVERYTHING you edit lives here
│   └── app.js              ← router + renderer (don't touch)
├── manifest.webmanifest    ← install metadata
├── sw.js                   ← service worker (offline + caching)
├── icons/                  ← generated app icons (+ the .svg sources)
└── README.md               ← this file
```

To regenerate the icons after editing an `icons/_logo-*.svg` source (requires
ImageMagick):

```bash
cd icons
magick -background none _logo-rounded.svg  -resize 192x192 icon-192.png
magick -background none _logo-rounded.svg  -resize 512x512 icon-512.png
magick -background none _logo-maskable.svg -resize 192x192 maskable-192.png
magick -background none _logo-maskable.svg -resize 512x512 maskable-512.png
magick -background none _logo-square.svg   -resize 180x180 apple-touch-icon.png
magick -background none _logo-rounded.svg  -resize 32x32   favicon-32.png
magick -background none _logo-rounded.svg  -resize 16x16   favicon-16.png
magick favicon-16.png favicon-32.png favicon.ico
```

---

## 🚀 Deploy (free, HTTPS, CDN-backed)

HTTPS is required for "Add to Home Screen." Any of these work — pick one:

### Option A — Netlify (easiest, drag-and-drop)
1. Go to **app.netlify.com** → log in.
2. Drag the **whole `into-action` folder** onto the "deploy" area.
3. You get a live `https://…netlify.app` URL instantly. Done.
4. (Optional) Site settings → change the site name, or add a custom domain.

### Option B — Cloudflare Pages
1. **dash.cloudflare.com** → Workers & Pages → Create → Pages → "Upload assets."
2. Upload the folder. Publish. You get a `https://….pages.dev` URL.

### Option C — GitHub Pages
1. Create a repo, upload all the files (keep the folder structure).
2. Repo → **Settings → Pages** → Source: `main` branch, `/ (root)` → Save.
3. Your URL is `https://<username>.github.io/<repo>/`.

### After deploying
1. Open the live URL on your phone and **Add to Home Screen** to test the install.
2. Paste the live URL into `META.shareUrl` in `content.js` and re-upload, so the
   in-app **Share** button always sends a clean link to newcomers.

---

## 📲 Installing on a phone
- **iPhone (Safari):** tap **Share** → **Add to Home Screen**. (The app shows a
  one-time hint.)
- **iPhone (Google app):** tap **Share** → **Open in Safari** or
  **Open in Chrome**. In that browser, tap **Share** → **Add to Home Screen**.
  The app detects the Google app and shows these steps automatically.
- **Android (Chrome):** tap the **Install** banner, or menu → **Install app**.

Once installed it launches full-screen with the sunrise icon and works offline.

---

## 🧪 Run it locally
From the project folder:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`. (A local server is needed for the service
worker; opening `index.html` directly with `file://` works for everything except
offline caching.)


## Reader and text size

The opening notice directs updates or changes to `meta.updatesEmail` in
`js/content.js`. Its X dismisses it until the page is reopened or reloaded;
changing sections keeps it dismissed. The email address opens a mail draft.

The Meeting Script is one continuous reading. Its A− / A+ controls and
**More → Text size** share Standard, Large (125%), and Extra large (150%) sizes.
Sizes last only while this page is open: reload returns to Standard. No reading
positions, favorites, or text-size preferences are written to browser storage.
Existing PDFs use their own viewer zoom controls.

The optional **Keep screen awake** control uses the browser's Screen Wake Lock
API on HTTPS (or localhost). It stops on leaving the script. If the app becomes
hidden, the lock is released; returning to the visible script requests it again
if the switch is still on. Unsupported browsers and denied requests show a
message and leave the reader usable.

## Verification

On iOS Home Screen launches, the outer page uses viewport height to avoid a
reported bottom gap with percentage heights and a translucent status bar.
Browser tabs and non-iOS devices retain their existing sizing. Navigation
keeps its safe-area padding. Confirm this workaround on a physical iPhone;
desktop emulation cannot verify the iOS system-owned screen area.

This is a static HTML/CSS/JavaScript app with no build system, package manifest,
type checker, or configured lint, format, test, or security scanner commands.
Run these available source checks from the project folder:

```bash
node --check js/app.js
node --check js/content.js
node --check sw.js
git diff --check
```

For reader changes, verify in a real browser at phone, tablet, and desktop widths:
continuous script wording; all three sizes across routes; no horizontal overflow;
keyboard operation and focus containment in the size dialog; reset after reload;
and screen-awake success, refusal, hidden-page, navigation, and unsupported states.
Check both a fresh context and an upgrade from an older cache. Verify the
continuous script survives an online reload and then an offline reload. In
browser automation, ensure service workers are actually handling requests;
bypassing them does not test updates or offline behavior.


## Visual system

The app uses Lora for headings and prayer readings, and Source Sans 3 for
navigation, controls, and the spoken meeting script. Latin variable WOFF2 fonts
are bundled under `assets/fonts/` and included in the offline app shell. Their
SIL Open Font License notices and source URLs are in the same folder. The app
no longer requests a remote font stylesheet.

Shared color and type settings are at the top of `css/styles.css`: navy for
navigation and headings, cool daylight surfaces for utility information, warm
paper for readings, and sunrise gold for important actions and selection.
Section styling uses `data-section` on the existing renderer; content and
navigation order remain in `js/content.js`. When updating cached assets, bump
the cache version in `sw.js`.
