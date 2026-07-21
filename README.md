# Vyloxgo — pitch website

A 4-page static site (no build step) for pitching the WhatsApp automation + Instagram + Ads growth package and the separate website-build package.

## Pages
- `index.html` — Home
- `services.html` — Services & Pricing (₹16,000/month system + ₹20,000 website build)
- `demo.html` — Live animated WhatsApp conversation → spreadsheet capture demo
- `portfolio.html` — Vyloxgo's own Instagram + website as proof of work

## Run locally
Just open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Deploy to GitHub Pages
1. Push this folder's contents to a new GitHub repo (root of the repo, not a subfolder).
2. In the repo: **Settings → Pages → Source → Deploy from a branch → `main` / root**.
3. Your site goes live at `https://<your-username>.github.io/<repo-name>/`.

No dependencies, no build tools — just HTML, CSS and vanilla JS, plus Google Fonts loaded via CDN link.

## Editing
- Colors, type and spacing tokens live at the top of `css/style.css`.
- The WhatsApp demo conversation and timing are in `js/demo.js` — edit the `script` array to change the messages.
- Update pricing numbers directly in `services.html`.
- Swap `assets/instagram-profile-cropped.png` if you want a fresher Instagram screenshot later.
