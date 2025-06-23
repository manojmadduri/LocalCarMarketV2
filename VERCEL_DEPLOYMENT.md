# Vercel Deployment Guide

This guide walks you through deploying The Integrity Auto and Body platform to Vercel.

## Prerequisites

1. A Vercel account (https://vercel.com)
2. Your Supabase database URL and credentials
3. Git repository with your project

## Step 1: Prepare Your Repository

1. Ensure your code is pushed to a Git repository (GitHub, GitLab, or Bitbucket)
2. The `vercel.json` configuration file is already included in your project

## Step 2: Environment Variables

In your Vercel dashboard, you'll need to add these environment variables:

```
DATABASE_URL=your-supabase-connection-string
PGHOST=your-supabase-host
PGPORT=6543
PGDATABASE=postgres
PGUSER=postgres
PGPASSWORD=your-supabase-password
NODE_ENV=production
```

## Step 3: Deploy to Vercel

### Option A: Vercel Dashboard
1. Go to https://vercel.com/dashboard
2. Click "New Project"
3. Import your Git repository
4. Configure the following build settings:
   - **Framework Preset**: Other
   - **Build Command**: `vite build`
   - **Output Directory**: `client/dist`
   - **Install Command**: `npm install`

### Option B: Vercel CLI
```bash
npm i -g vercel
vercel login
vercel --prod
```

## Step 4: Configure Database

Your Supabase database should already have the necessary tables. If you need to recreate them:

```sql
-- Run this in your Supabase SQL editor if needed
CREATE TABLE IF NOT EXISTS car_analytics (
  id SERIAL PRIMARY KEY,
  "carId" INTEGER UNIQUE NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
  "totalViews" INTEGER DEFAULT 0 NOT NULL,
  "viewsToday" INTEGER DEFAULT 0 NOT NULL,
  "viewsThisWeek" INTEGER DEFAULT 0 NOT NULL,
  "contactInquiries" INTEGER DEFAULT 0 NOT NULL,
  "phoneClicks" INTEGER DEFAULT 0 NOT NULL,
  "shareCount" INTEGER DEFAULT 0 NOT NULL,
  "lastViewedAt" TIMESTAMP,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS car_view_log (
  id SERIAL PRIMARY KEY,
  "carId" INTEGER NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
  "sessionId" TEXT,
  "userAgent" TEXT,
  "ipAddress" TEXT,
  "viewedAt" TIMESTAMP DEFAULT NOW() NOT NULL,
  "timeSpent" INTEGER,
  "referrer" TEXT
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_car_analytics_car_id ON car_analytics("carId");
CREATE INDEX IF NOT EXISTS idx_car_view_log_car_id ON car_view_log("carId");
CREATE INDEX IF NOT EXISTS idx_car_view_log_viewed_at ON car_view_log("viewedAt");
```

## Step 5: Domain Configuration

1. In Vercel dashboard, go to your project settings
2. Navigate to "Domains"
3. Add your custom domain if needed
4. Update any hardcoded URLs in your application

## Important Notes

- **Database Connection**: Make sure your Supabase project allows connections from Vercel's IP ranges
- **Environment Variables**: All sensitive data should be stored in Vercel's environment variables, not in code
- **Build Time**: Initial deployment may take 3-5 minutes
- **Functions**: API routes will be deployed as Vercel Functions with a 10-second timeout on hobby plan

## Troubleshooting

### Common Issues:

1. **Function Runtime Error**
   - The error "Function Runtimes must have a valid version" is fixed with the updated vercel.json configuration
   - Ensure you're using `nodejs18.x` runtime specification

2. **Database Connection Failed**
   - Verify your DATABASE_URL is correct
   - Check Supabase connection pooling settings

3. **Build Failed**
   - Check build logs in Vercel dashboard
   - Ensure all dependencies are listed in package.json

4. **API Routes Not Working**
   - Verify the `/api` folder structure
   - Check function logs in Vercel dashboard

5. **Static Files Not Loading**
   - Confirm build output is in `client/dist`
   - Check asset paths in your HTML

### Performance Optimization:

- Enable Vercel's Edge Network for global CDN
- Use Vercel Analytics to monitor performance
- Consider upgrading to Pro plan for better function limits

## Post-Deployment Checklist

- [ ] Test all car listing pages
- [ ] Verify analytics tracking works
- [ ] Test contact forms
- [ ] Check social sharing functionality
- [ ] Verify admin login works
- [ ] Test mobile responsiveness
- [ ] Confirm all images load correctly

Your automotive platform should now be live on Vercel with real-time analytics tracking and full database functionality!