# GitHub Pages Deployment Guide

This repository is configured to deploy to GitHub Pages with **only Trailer and Viral modes**.

## Files Deployed to GitHub Pages:

### ✅ Included:
- `index.html` - Main page (with only 4 modes: Professional, Comedy, Trailer, Viral)
- `styles.css` - Styling
- `script.js` - Main JavaScript
- `trailer-mode.js` - Movie Trailer mode
- `viral-mode.js` - Viral Mode
- `sw.js` - Service Worker (from `sw-deploy.js`)
- `manifest.json` - PWA manifest
- Icon files

### ❌ Excluded from deployment:
- `billionaire-mode.js`
- `tv-show-runner.js`
- `ai-commercials.js`
- `okjason-vlog.js`
- `abstract-art-mode.js`
- `product-mode.js`
- `video-prompt-generator.html` (local version with all modes)

## Local Development (All Modes):

To run locally with **all 10 modes**:

1. Open `video-prompt-generator.html` in your browser
2. Or serve with: `python3 -m http.server 8080`
3. Go to: `http://localhost:8080/video-prompt-generator.html`

## Deployment Instructions:

### First Time Setup:

1. Go to your repository settings: https://github.com/okjason-source/video-prompt-generator/settings/pages
2. Under "Source", select: **GitHub Actions**
3. Save the settings

### Deploy:

Simply push to the `main` branch:

```bash
git add .
git commit -m "Deploy with Trailer and Viral modes"
git push origin main
```

The GitHub Actions workflow will automatically:
1. Copy only the necessary files to a `deploy` folder
2. Deploy to GitHub Pages
3. Your site will be live at: `https://okjason-source.github.io/video-prompt-generator/`

## Adding More Modes to Deployment:

To add more modes to the GitHub Pages deployment:

1. Edit `index.html` - add the mode option in the dropdown
2. Edit `index.html` - add the script tag for the mode file
3. Edit `sw-deploy.js` - add the mode file to the `urlsToCache` array
4. Edit `.github/workflows/deploy.yml` - add the mode file to the copy commands
5. Commit and push

## File Structure:

```
video-prompt-generator/
├── .github/workflows/deploy.yml  # GitHub Actions workflow
├── index.html                     # Deployment version (4 modes)
├── video-prompt-generator.html    # Local version (10 modes)
├── sw-deploy.js                   # Service Worker for deployment
├── sw.js                          # Service Worker for local
├── script.js                      # Main JavaScript
├── styles.css                     # Styling
├── trailer-mode.js               # ✅ Deployed
├── viral-mode.js                 # ✅ Deployed
├── billionaire-mode.js           # ❌ Not deployed
├── tv-show-runner.js             # ❌ Not deployed
├── ai-commercials.js             # ❌ Not deployed
├── okjason-vlog.js               # ❌ Not deployed
├── abstract-art-mode.js          # ❌ Not deployed
└── product-mode.js               # ❌ Not deployed
```

