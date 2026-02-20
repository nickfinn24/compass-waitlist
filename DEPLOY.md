# Deploy Compass Waitlist

## Fix: Clean deployment (no folder confusion)

The main repo has multiple projects. For a clean deploy, use a **standalone repo**:

### Step 1: Create new repo on GitHub

1. Go to [github.com/new](https://github.com/new)
2. Name it `compass-waitlist`
3. Leave it **empty** (no README)
4. Create

### Step 2: Push waitlist to the new repo

Run from the `career-platform` folder:

```bash
cd /Users/nicklogan/Projects/career-platform
git push https://github.com/YOUR_USERNAME/compass-waitlist.git waitlist-only:main
```

Replace `YOUR_USERNAME` with your GitHub username (e.g. `nickfinn24`).

### Step 3: Deploy on Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import `compass-waitlist` (no root directory needed – it’s already the app root)
3. Add env vars: `ADMIN_PASSWORD` (and Supabase vars when ready)
4. Deploy

---

## Alternative: Deploy from main repo

If you prefer to keep everything in Career-Platform-MVP:

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import `Career-Platform-MVP`
3. **Important:** Set **Root Directory** to `waitlist-landing`
4. Add env vars
5. Deploy

---

## Remove the wrong "landingpage" repo

If Vercel created a `landingpage` repo by mistake:

1. Go to [github.com/YOUR_USERNAME/landingpage](https://github.com)
2. Settings → Delete this repository (if you don’t need it)
