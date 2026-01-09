# Tither - Render Deployment Guide

## Prerequisites
- GitHub account with this repository pushed
- Render.com account
- Custom domain: tither.us (optional)

## Quick Deploy Steps

### 1. Push to GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/tither.git
git branch -M main
git push -u origin main
```

### 2. Deploy on Render

**Option A: Use render.yaml (Recommended)**
1. Go to [render.com](https://render.com) and sign in
2. Click **New → Blueprint**
3. Connect your GitHub repository
4. Render will auto-detect `render.yaml` and create services

**Option B: Manual Setup**
1. Go to [render.com](https://render.com) → **New → Web Service**
2. Connect your GitHub repository
3. Configure:
   - **Name**: tither
   - **Region**: Oregon (or closest to users)
   - **Runtime**: Node
   - **Build Command**: `npm install --include=dev && npm run build`
   - **Start Command**: `npm run start`

**IMPORTANT**: The `--include=dev` flag is required because the build tools (tsx, vite, tailwindcss) are in devDependencies.

### 3. Create PostgreSQL Database
1. In Render dashboard → **New → PostgreSQL**
2. Configure:
   - **Name**: tither-db
   - **Region**: Same as web service
   - **Plan**: Starter ($7/month) or Free
3. Copy the **Internal Database URL**

### 4. Set Environment Variables
In your web service settings → **Environment**:

| Key | Value |
|-----|-------|
| `DATABASE_URL` | Your PostgreSQL connection string |
| `SESSION_SECRET` | Generate a random 32+ character string |
| `NODE_ENV` | `production` |

### 5. Connect Custom Domain (tither.us)

1. In Render → Your Web Service → **Settings → Custom Domains**
2. Add `tither.us` and `www.tither.us`
3. Render will provide DNS records

**At your domain registrar (GoDaddy, Namecheap, etc.):**

```
Type    Name    Value
A       @       Render's IP address (provided)
CNAME   www     your-app.onrender.com
```

### 6. Verify Deployment
- Health check: `https://tither.us/api/health`
- Main app: `https://tither.us`

## File Structure for Render

```
tither/
├── client/           # React frontend
├── server/           # Express backend
├── shared/           # Shared types/schemas
├── script/           # Build scripts
├── dist/             # Built output (generated)
├── render.yaml       # Render deployment config
├── package.json      # Dependencies & scripts
├── postcss.config.cjs # PostCSS config (CommonJS)
├── tailwind.config.cjs # Tailwind config (CommonJS)
├── .nvmrc            # Node version
└── .node-version     # Node version (alternative)
```

## Build Process

The build command runs:
1. `npm install` - Install dependencies
2. `npm run build` - Runs `script/build.ts` which:
   - Builds React frontend with Vite → `dist/public/`
   - Bundles Express server with esbuild → `dist/index.cjs`

The start command runs:
- `npm run start` - Runs `node dist/index.cjs`

## Troubleshooting

### Build Fails: PostCSS/Tailwind errors
Ensure you're using the `.cjs` config files:
- `postcss.config.cjs` (not `.js`)
- `tailwind.config.cjs` (not `.ts`)

### Database Connection Issues
- Verify `DATABASE_URL` is set correctly
- Use **Internal** connection string (not External)
- Ensure database and web service are in same region

### TypeScript Errors
- Node 20 is required (see `.nvmrc`)
- Run `npm run check` locally to verify types

### Static Files Not Loading
- Ensure build completed successfully
- Check `dist/public/` contains built files
- Verify server serves from correct path

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `SESSION_SECRET` | Yes | Random string for session encryption |
| `NODE_ENV` | Yes | Set to `production` |
| `PORT` | No | Render sets this automatically |

## SSL/HTTPS
Render provides free SSL certificates automatically for custom domains.

## Scaling
Render's starter plan ($7/month) includes:
- 512 MB RAM
- 0.5 CPU
- Auto-sleep after 15 min inactivity (free tier)

For production, consider upgrading to Standard plan.
