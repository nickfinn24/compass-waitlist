# Deploy Compass Waitlist to the Web

## Option 1: Vercel (recommended, free)

1. **Push to GitHub** (if not already):
   ```bash
   git add .
   git commit -m "Add waitlist landing"
   git push
   ```

2. **Deploy on Vercel**:
   - Go to [vercel.com](https://vercel.com) and sign in (GitHub)
   - Click **Add New** → **Project**
   - Import your `career-platform` repo
   - Set **Root Directory** to `waitlist-landing`
   - Add environment variables (Settings → Environment Variables):
     - `ADMIN_PASSWORD` – your admin password
     - `NEXT_PUBLIC_SUPABASE_URL` – (when ready)
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY` – (when ready)
   - Click **Deploy**

3. Your site will be live at `https://your-project.vercel.app`

## Option 2: Vercel CLI (after login)

```bash
cd waitlist-landing
npx vercel login
npx vercel --prod
```

## Option 3: Netlify

1. Go to [netlify.com](https://netlify.com) → Add new site → Import from Git
2. Select your repo, set base directory to `waitlist-landing`
3. Build command: `npm run build`
4. Publish directory: `.next` (or use Netlify’s Next.js plugin)
5. Add env vars in Site settings → Environment variables

## Custom domain

In Vercel/Netlify: Project Settings → Domains → Add your domain.
