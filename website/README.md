# CleanSpark Website

## 🚀 Quick Start

### Development
```bash
cd website
npm install
npm run dev
```

### Build for Production
```bash
cd website
npm install
npm run build
```

The built files will be in the `dist/` folder.

## 📦 Deployment

### GitHub Pages (Automated)
The site is automatically built and deployed to GitHub Pages when you push to the `main` branch.

**GitHub Pages Settings:**
1. Go to your repository settings
2. Navigate to "Pages"
3. Source: "GitHub Actions"
4. The workflow will automatically deploy the built site

### Manual Deployment
1. Build the site: `npm run build`
2. The `dist/` folder contains the built files
3. Deploy the `dist/` folder to your hosting provider

### Vercel/Netlify
These platforms automatically detect Vite and build the site:
- **Vercel**: Connect your GitHub repo, it will auto-detect and deploy
- **Netlify**: Connect your GitHub repo, set build command: `cd website && npm install && npm run build`, publish directory: `website/dist`

## 🔧 Configuration

### Base Path
If deploying to a subdirectory, update `base` in `vite.config.js`:
```js
base: '/your-repo-name/'
```

### Environment Variables
Create a `.env` file for environment-specific variables:
```
VITE_CONTRACT_ADDRESS=0x...
VITE_PROJECT_ID=...
```

## 📝 Notes

- The site uses ES modules and requires a build step
- Don't commit the `dist/` folder to git (it's auto-generated)
- Always build before deploying manually
- GitHub Actions automatically builds and deploys on push
