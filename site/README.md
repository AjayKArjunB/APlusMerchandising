# A+ Merchandising — Static Site

This folder contains a ready-to-deploy static site (dark theme demo) for A+ Merchandising.

Preview locally

1. From the repository root, run a static file server. For example, using Python 3:

   ```bash
   cd site
   python3 -m http.server 8080
   # open http://localhost:8080
   ```

2. Or use VS Code Live Server extension.

Notes & next steps

- Contact form is demo-only. Replace the form `action` in `index.html` with your Formspree endpoint or integrate a server to handle submissions.
- Checkout is a demo alert. To accept payments integrate with Stripe, PayPal, or another gateway.
- Product images were imported from the provided deck PDF and placed under `site/images/` (and `site/images/extracted/`); review and replace any images with high-resolution product photos where desired.
- Remove any temporary extracted assets you don't need (PPM files were removed from the repo to save space).
- Deploy to GitHub Pages: push the `site/` contents to a branch (e.g., `gh-pages`) or configure GitHub Pages to serve from the `site/` folder.

Quick deploy to GitHub Pages (simple approach):

```bash
# from repo root
# ensure the site folder contents are published to the gh-pages branch
git worktree add /tmp/gh-pages gh-pages || (git checkout -b gh-pages && git worktree add /tmp/gh-pages gh-pages)
rm -rf /tmp/gh-pages/*
cp -r site/* /tmp/gh-pages/
cd /tmp/gh-pages
git add .
git commit -m "Publish site"
git push origin gh-pages
```

If you want, I can commit these changes to a branch and prepare a deploy commit for GitHub Pages. If you'd like, I can also open a pull request with the `site/` content prepared for publishing.
