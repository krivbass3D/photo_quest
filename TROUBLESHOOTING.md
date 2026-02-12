# 🔧 TROUBLESHOOTING GUIDE - PhotoQuest

Common issues specific to Vue 3 + TypeScript + Vite + Supabase + Gemini stack.

---

## 🚨 Critical Setup Issues

### Issue 1: Import Path Errors

**Symptom:**
```
Cannot find module '@/components/MyComponent'
Error: Cannot resolve '@/...'
```

**Cause:** Path aliases not configured properly

**Solution:**
1. Check `tsconfig.json`:
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

2. Check `vite.config.ts`:
```typescript
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
```

3. Restart dev server: `pnpm dev`

**Validate:** Try importing a component with `@/`

---

### Issue 2: TypeScript Errors in .vue Files

**Symptom:**
```
Property 'xxx' does not exist on type 'ComponentPublicInstance'
Red squiggles everywhere in <script setup>
```

**Cause:** VS Code using wrong TypeScript server or Vetur instead of Volar

**Solution:**
1. Install Volar extension (Vue - Official)
2. **Disable** Vetur if installed
3. Reload VS Code window
4. Check `.vscode/settings.json`:
```json
{
  "typescript.tsdk": "node_modules/typescript/lib"
}
```

**Validate:** `pnpm type-check` should pass

---

### Issue 3: Tailwind Classes Not Working

**Symptom:**
```
CSS classes applied but no styling
Background colors, padding not visible
```

**Cause:** Tailwind not configured to scan Vue files

**Solution:**
1. Check `tailwind.config.ts`:
```typescript
export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}'  // MUST include .vue
  ],
  // ...
}
```

2. Check `src/assets/styles/main.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

3. Check `src/main.ts` imports main.css:
```typescript
import './assets/styles/main.css'
```

4. Restart dev server

**Validate:** `pnpm dev`, check element in DevTools

---

## 🔌 Supabase Connection Issues

### Issue 4: Supabase Client Initialization Fails

**Symptom:**
```
supabaseUrl is required
Cannot read properties of undefined
```

**Cause:** Environment variables not loaded

**Solution:**
1. Check `.env.local` exists (not `.env`)
2. Verify format:
```bash
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
```

3. **CRITICAL:** Variables MUST start with `VITE_` in Vite
4. Restart dev server (Vite doesn't hot-reload env changes)

**Validate:**
```typescript
console.log(import.meta.env.VITE_SUPABASE_URL)
```

---

### Issue 5: Supabase RLS Policy Blocks Requests

**Symptom:**
```
Error: new row violates row-level security policy
403 Forbidden on INSERT/SELECT
```

**Cause:** Row Level Security enabled but policies not configured

**Solution:**
1. Go to Supabase Dashboard → Authentication → Policies
2. For MVP, temporarily disable RLS or allow all:
```sql
-- Allow all for development
ALTER TABLE quests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all for development"
ON quests
FOR ALL
USING (true)
WITH CHECK (true);
```

3. For production, create proper policies:
```sql
CREATE POLICY "Users can insert their own quests"
ON quests
FOR INSERT
WITH CHECK (auth.uid() = user_id);
```

**Validate:** Try INSERT operation

---

### Issue 6: Storage Bucket Upload Fails

**Symptom:**
```
Error uploading file
Storage bucket not found
```

**Cause:** Bucket doesn't exist or permissions wrong

**Solution:**
1. Go to Supabase Dashboard → Storage
2. Create bucket named `quest-photos`
3. Set to **Public** for MVP
4. Add policy:
```sql
CREATE POLICY "Allow public uploads"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'quest-photos');
```

**Validate:** Upload a test file via client

---

## 🤖 AI Integration Issues

### Issue 7: Gemini API Key Invalid

**Symptom:**
```
400 API_KEY_INVALID
401 Unauthorized
```

**Cause:** Wrong API key or not activated

**Solution:**
1. Go to https://makersuite.google.com/app/apikey
2. Create new API key
3. Copy to `.env.local`:
```bash
VITE_GEMINI_API_KEY=AIzaSy...
```
4. Verify key works:
```bash
curl -H "Content-Type: application/json" \
  -d '{"contents":[{"parts":[{"text":"Hello"}]}]}' \
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=YOUR_KEY"
```

**Validate:** Test in app

---

### Issue 8: Gemini Vision Not Working

**Symptom:**
```
Error: Invalid image format
400 Bad Request
```

**Cause:** Image not properly base64 encoded or wrong MIME type

**Solution:**
1. Check image conversion:
```typescript
const toBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const base64 = reader.result as string
      // Remove data:image/jpeg;base64, prefix
      resolve(base64.split(',')[1])
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}
```

2. Verify MIME type:
```typescript
const mimeType = file.type // Should be image/jpeg, image/png, etc.
```

3. Check Gemini request format:
```typescript
const response = await model.generateContent([
  prompt,
  {
    inlineData: {
      mimeType: 'image/jpeg',
      data: base64Data
    }
  }
])
```

**Validate:** Upload photo, check console

---

### Issue 9: AI Hallucinating Locations

**Symptom:**
AI creates tasks for places that don't exist in the city

**Cause:** Not using Overpass POI data, AI inventing locations

**Solution:**
1. ALWAYS fetch POIs from Overpass first
2. Include POI names in prompt:
```typescript
const prompt = `
Create tasks ONLY for these real locations:
${pois.map(p => p.name).join(', ')}

Do not invent new places.
`
```

3. Validate AI output against POI list

**Validate:** Check generated tasks match POI names

---

## 🌐 Overpass API Issues

### Issue 10: Overpass Timeout

**Symptom:**
```
Error: Request timeout
504 Gateway Timeout
```

**Cause:** Query too complex or server overloaded

**Solution:**
1. Simplify query - request fewer POIs:
```javascript
// Instead of all tourism
node["tourism"](around:5000,${lat},${lon});

// Just attractions
node["tourism"="attraction"](around:3000,${lat},${lon});
```

2. Add timeout to query:
```
[out:json][timeout:25];
```

3. Use different Overpass server:
```typescript
const OVERPASS_URLS = [
  'https://overpass-api.de/api/interpreter',
  'https://lz4.overpass-api.de/api/interpreter',
  'https://z.overpass-api.de/api/interpreter'
]
```

**Validate:** Test query in browser

---

### Issue 11: No POIs Found

**Symptom:**
Overpass returns empty array for a city

**Cause:** Wrong coordinates or no data in OSM for that area

**Solution:**
1. Verify coordinates are correct (lat, lon not reversed)
2. Check on openstreetmap.org if POIs exist
3. Expand search radius:
```
around:10000  // Instead of 5000
```

4. Broaden POI types:
```
node["tourism"](around:5000,${lat},${lon});
node["historic"](around:5000,${lat},${lon});
node["amenity"="museum"](around:5000,${lat},${lon});
```

**Validate:** Check response has data

---

## 🖼️ Photo Upload Issues

### Issue 12: Photo Too Large

**Symptom:**
```
Request Entity Too Large
413 Payload Too Large
```

**Cause:** Photo exceeds 2MB limit

**Solution:**
1. Compress before upload:
```typescript
const compressImage = async (file: File): Promise<Blob> => {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')!
  const img = new Image()
  
  return new Promise((resolve) => {
    img.onload = () => {
      // Resize to max 1200px width
      const maxWidth = 1200
      const ratio = maxWidth / img.width
      canvas.width = maxWidth
      canvas.height = img.height * ratio
      
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      canvas.toBlob((blob) => resolve(blob!), 'image/jpeg', 0.8)
    }
    img.src = URL.createObjectURL(file)
  })
}
```

2. Add file size check:
```typescript
if (file.size > 2 * 1024 * 1024) { // 2MB
  // Compress or reject
}
```

**Validate:** Upload large photo

---

### Issue 13: Camera Not Opening on Mobile

**Symptom:**
File input doesn't open camera on phone

**Cause:** Missing `capture` attribute or wrong MIME type

**Solution:**
```html
<input
  type="file"
  accept="image/*"
  capture="environment"
  @change="handlePhoto"
/>
```

**Key attributes:**
- `accept="image/*"` - only images
- `capture="environment"` - rear camera
- `capture="user"` - front camera

**Validate:** Test on actual mobile device

---

## 🔄 Vue Router Issues

### Issue 14: Router Not Navigating

**Symptom:**
URL changes but page doesn't update

**Cause:** RouterView not in App.vue or router not registered

**Solution:**
1. Check `App.vue`:
```vue
<template>
  <RouterView />
</template>
```

2. Check `main.ts`:
```typescript
import router from './router'
app.use(router)
```

3. Verify routes exist:
```typescript
// router/routes.ts
export const routes = [
  { path: '/', component: HomeView },
  { path: '/setup', component: QuestSetupView }
]
```

**Validate:** Click link, URL should change + page updates

---

### Issue 15: 404 on Page Refresh (Deployed)

**Symptom:**
Works in dev, but deployed site shows 404 on refresh

**Cause:** Vercel doesn't know about client-side routing

**Solution:**
Create `vercel.json` in root:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

**Validate:** Deploy, refresh /setup route

---

## 🎨 UI/Component Issues

### Issue 16: Component Not Rendering

**Symptom:**
Blank screen, no errors in console

**Cause:** Various possibilities

**Solution checklist:**
1. Component imported correctly:
```typescript
import TaskCard from '@/components/quest/TaskCard.vue'
```

2. Component registered (if using Options API):
```typescript
export default {
  components: { TaskCard }
}
```

3. In Composition API `<script setup>`, imports auto-register

4. Check component has `<template>`:
```vue
<template>
  <div>Content here</div>
</template>
```

5. Check browser console for runtime errors

**Validate:** Add `{{ 'test' }}` to template

---

### Issue 17: Reactive Data Not Updating

**Symptom:**
Change data but UI doesn't update

**Cause:** Not using reactive primitives correctly

**Solution:**
```typescript
// ❌ Wrong
let count = 0
count++ // Not reactive

// ✅ Correct
const count = ref(0)
count.value++ // Reactive

// ❌ Wrong
const user = { name: 'John' }
user.name = 'Jane' // Not reactive

// ✅ Correct
const user = reactive({ name: 'John' })
user.name = 'Jane' // Reactive
```

**Validate:** Check Vue DevTools

---

## 🚀 Build/Deploy Issues

### Issue 18: Build Fails with Type Errors

**Symptom:**
```
pnpm build fails
vue-tsc errors
```

**Cause:** TypeScript errors in code

**Solution:**
1. Run type check: `pnpm type-check`
2. Fix all errors shown
3. Common fixes:
```typescript
// Add types to function params
const handleClick = (event: Event) => { }

// Type props
interface Props {
  title: string
}
const props = defineProps<Props>()

// Type refs
const count = ref<number>(0)
```

**Validate:** `pnpm build` succeeds

---

### Issue 19: Environment Variables Not Working in Production

**Symptom:**
Works locally, breaks on Vercel

**Cause:** Env vars not added to Vercel

**Solution:**
1. Go to Vercel Dashboard → Project → Settings → Environment Variables
2. Add all `VITE_*` variables
3. Redeploy

**Important:** On Vercel, env vars MUST be added through dashboard, `.env.local` is not deployed

**Validate:** Check deployed site console logs

---

## 📱 Mobile-Specific Issues

### Issue 20: Touch Events Not Working

**Symptom:**
Buttons work on desktop, not on mobile

**Cause:** Using mouse events instead of touch events

**Solution:**
Use Vue's built-in handlers:
```vue
<button @click="handleClick">
  <!-- @click works for both mouse and touch -->
</button>
```

Or handle both:
```vue
<div
  @mousedown="handleStart"
  @touchstart="handleStart"
  @mouseup="handleEnd"
  @touchend="handleEnd"
>
```

**Validate:** Test on real device

---

### Issue 21: Viewport Too Small on Mobile

**Symptom:**
Text tiny on phone, layout broken

**Cause:** Missing viewport meta tag

**Solution:**
Check `index.html`:
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

**Validate:** Check mobile view in DevTools

---

## 🔍 Debugging Tips

### General Debugging Workflow

1. **Check browser console** for errors
2. **Check network tab** for failed requests
3. **Use Vue DevTools** to inspect component state
4. **Add console.logs** to trace execution
5. **Check** `.env.local` has correct values
6. **Restart dev server** after config changes
7. **Clear browser cache** if seeing old code
8. **Check Supabase logs** for backend errors

### Useful Commands

```bash
# Type check
pnpm type-check

# Lint
pnpm lint

# Build (catches errors)
pnpm build

# Check env vars loaded
console.log(import.meta.env)

# Supabase logs
supabase functions logs
```

---

## 🆘 When All Else Fails

1. **Delete `node_modules` and reinstall:**
```bash
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

2. **Clear Vite cache:**
```bash
rm -rf node_modules/.vite
```

3. **Reset Supabase local:**
```bash
supabase db reset
```

4. **Check GitHub Issues:**
- Vue 3: https://github.com/vuejs/core/issues
- Vite: https://github.com/vitejs/vite/issues
- Supabase: https://github.com/supabase/supabase/issues

5. **Ask in Discord:**
- Vue Land: https://chat.vuejs.org
- Vite: https://chat.vitejs.dev
- Supabase: https://discord.supabase.com

---

**Remember:** Most issues are configuration problems. Check configs first before diving into code debugging.
