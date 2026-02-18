# hananediouane.com

Personal professional website for Hanane Diouane — Architect & Environmental Consultant.

## Tech Stack

- React 18 + Vite
- Tailwind CSS (via CDN)
- Lucide React icons
- GitHub Pages deployment

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Deployment

Push to `main` branch — GitHub Actions auto-deploys to GitHub Pages.

## Structure

```
├── public/
│   ├── photo-hanane.jpg    # Professional photo (add your own)
│   ├── favicon.svg
│   ├── CNAME
│   └── robots.txt
├── src/
│   ├── App.jsx
│   ├── main.jsx
│   ├── translations.js
│   └── index.css
├── index.html
├── package.json
└── vite.config.js
```

## Customization

1. Add your professional photo to `public/photo-hanane.jpg`
2. Update `src/translations.js` for content changes
3. Update meta tags in `index.html`
4. Replace `{FORM_ID}` in `src/App.jsx` with your Formspree form ID

## 📧 Email Setup

`contact@hananediouane.com` is configured via **Cloudflare Email Routing** (free) with Gmail as the backend.

- **Receive emails:** Cloudflare forwards `contact@hananediouane.com` → your Gmail
- **Send emails:** Gmail "Send mail as" feature lets you reply as `contact@hananediouane.com`
- **Contact form:** Formspree sends form submissions to `contact@hananediouane.com`

**Privacy:** No personal email address is ever exposed on the site or in source code.

See [`docs/EMAIL-SETUP.md`](docs/EMAIL-SETUP.md) for step-by-step setup instructions.

## License

MIT
