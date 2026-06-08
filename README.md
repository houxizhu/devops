# Xizhu Hou — DevOps & Platform Engineer

Personal portfolio site. Static HTML/CSS/JS — no build step, no dependencies to install.

**Live site:** https://houxizhu.github.io/devops/

## What's inside

| File | Purpose |
|---|---|
| `index.html` | The site (single page) |
| `styles.css` | All styling — design tokens + sections |
| `site.js` | Interactions: typing terminal, animated CI/CD pipeline, scroll reveals |
| `tweaks-panel.jsx` / `tweaks-app.jsx` | Optional in-page theme controls (React + Babel, loaded from CDN) |
| `assets/` | Monogram, photo, paper-grain texture, résumé PDF |

## GitHub Pages
The included `.nojekyll` file tells Pages to serve every file as-is (so the `.jsx` files aren't touched).

## Tech

- Fonts: Fraunces + Space Grotesk + Space Mono (Google Fonts)
- No framework for the page itself — vanilla JS
- React is loaded from a CDN only to power the optional Tweaks panel

---

© 2026 Xizhu Hou
