# 🚀 Supabase Edge Functions Deployment Guide

Follow these steps to deploy and configure your Edge Functions for PhotoQuest.

## 1. Install Supabase CLI (Windows)

The `npm install -g supabase` command is not supported on Windows. Use one of these methods:

### Method A: Scoop (Recommended)

If you have [Scoop](https://scoop.sh/) installed:

```powershell
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase
```

### Method B: Chocolatey

If you have [Chocolatey](https://chocolatey.org/) installed:

```powershell
choco install supabase
```

### Method C: npx (No install required)

You can prefix all commands with `npx`:

```bash
npx supabase login
npx supabase functions deploy generate-quest --no-verify-jwt
npx supabase functions deploy validate-photo --no-verify-jwt
```

## 2. Initialize & Login

Login to your Supabase account:

```bash
supabase login
```

## 3. Link Your Project

Go to your [Supabase Dashboard](https://supabase.com/dashboard), find your **Project Ref** (in Project Settings > General), and run:

```bash
supabase link --project-ref [YOUR_PROJECT_REF]
```

## 4. Configure Secrets (Environment Variables)

Edge Functions need your API keys. Set them using the CLI:

```bash
supabase secrets set VITE_GEMINI_API_KEY=your_actual_key
```

_(Repeat for other variables like VITE_SUPABASE_URL if needed inside functions)_

## 5. Deploy the Function

Run this command from your project root:

```bash
supabase functions deploy generate-quest
```

## 6. Verify

Once deployed, you can see your function in the Supabase Dashboard under **Edge Functions**.

> [!TIP]
> To test locally before deploying, you can use:
> `supabase functions serve generate-quest --no-verify-jwt`
