# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Static wedding website for SHODAI & SAYAKA (2026.09). No build tools or package manager — open `index.html` directly in a browser or serve with any static file server.

## Architecture

Single-page site with three files of substance:

- **`index.html`** — All 7 sections in order: Hero → Groom Profile → Bride Profile → Couple → Guest Message → Secret Code → Guest Page (overlay)
- **`css/style.css`** — All styles. Sections are clearly delimited by comments matching the HTML section order.
- **`js/guests.js`** — The only file that needs editing for each new guest. Defines the `GUESTS` object keyed by code string.
- **`js/app.js`** — Animation logic (masonry scroll, Ken Burns, IntersectionObserver fade-in) and guest page open/close. Depends on `GUESTS` from `guests.js`.

## Guest Code System

Each guest gets a unique code printed on their place card. Entering it in the Secret Code section opens a personal overlay page.

To add a guest, edit `js/guests.js`:

```js
"GUESTCODE": {
  name: "田中 次郎 様",
  message: "メッセージ本文（\\n で改行）",
  image: ""  // 画像パスを指定、不要なら空文字
}
```

Codes are matched case-insensitively (input is `.toUpperCase()` before lookup).

## Image Folders

| Folder | Used by |
|--------|---------|
| `images/GROOMbackg/` | Groom profile masonry background (12 images, listed in `app.js:GROOM_BG_IMAGES`) |
| `images/BRIDEbackg/` | Bride profile masonry background (11 images, listed in `app.js:BRIDE_BG_IMAGES`) |
| `images/groomandbride/` | Couple section (referenced in HTML inline styles) |
| `images/` (root) | Hero and Couple section backgrounds (referenced in HTML inline styles) |

## Key CSS Notes

- Dark theme: `--color-bg: #090908`, accent gold: `--color-gold: #c9a96e`
- Profile masonry brightness is controlled by `.masonry-bg { filter: brightness(...) }` — applies to both Groom and Bride simultaneously
- Mobile overrides are in `@media (max-width: 640px)` and `@media (max-width: 400px)` at the bottom of `style.css`
- The responsive block around line 840 (indented, ending with a lone `}`) is missing its `@media` wrapper — those rules currently apply globally
