# Compass Waitlist Landing

A conversion-focused landing page for Compass (career clarity + mentorship for students). Built with Next.js, TypeScript, and Tailwind.

## Features

- Waitlist signup form (email, role, school, referral)
- Supabase storage for signups
- Admin dashboard at `/admin` to view and export signups
- Mobile-responsive design

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Copy `.env.example` to `.env.local` and fill in:

```bash
cp .env.example .env.local
```

**Required for data storage:**
- `NEXT_PUBLIC_SUPABASE_URL` – Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` – Supabase anon/public key

**Required for admin dashboard:**
- `ADMIN_PASSWORD` – Password to access `/admin` and view signups

**Optional:**
- `SUPABASE_SERVICE_ROLE_KEY` – Use for admin reads if you enable RLS on the waitlist table

### 3. Create the Supabase table

In your [Supabase](https://supabase.com) project, open the SQL Editor and run the contents of `SUPABASE_WAITLIST.sql`.

## Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The landing page is at `/`, the admin dashboard at `/admin`.

## Admin Dashboard

1. Go to `/admin`
2. Enter your `ADMIN_PASSWORD`
3. View all waitlist signups in a table
4. Use **Refresh** to reload, **Export CSV** to download the list

## Deployment

```bash
npm run build
npm run start
```

Deploy to Vercel, Railway, or any Node.js host. Set the env vars in your deployment platform.
