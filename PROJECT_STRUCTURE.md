# 📁 PHOTOQUEST - PROJECT STRUCTURE
## Optimized for Claude AI Development

> **Important:** After each significant code change, Claude will suggest a specific validation command (test, lint, or dev server check).

---

## 🎯 Quick Reference

**Languages:**
- Documentation/Comments: English
- UI Text (i18n): German
- Code: English
- AI Prompts: English

**File Size Limit:** Max 200 lines per file
**Development Mode:** Step-by-step with confirmation

---

## 📂 PART 1: PROJECT STRUCTURE (Reference)

### Root Directory

```
photoquest/
├── .vscode/                       # VS Code settings
├── docs/                          # Documentation
├── public/                        # Static assets
├── src/                           # Application source
├── supabase/                      # Supabase config & functions
├── .env.example                   # Environment template
├── .env.local                     # Local env (gitignored)
├── .eslintrc.cjs                  # ESLint config
├── .gitignore                     # Git ignore rules
├── .prettierrc                    # Prettier config
├── index.html                     # HTML entry
├── package.json                   # Dependencies
├── pnpm-lock.yaml                 # Lock file
├── postcss.config.js              # PostCSS config
├── README.md                      # Main readme
├── tailwind.config.ts             # Tailwind config
├── tsconfig.json                  # TypeScript config
├── tsconfig.node.json             # Node TS config
└── vite.config.ts                 # Vite config
```

---

### `/src` - Application Source

```
src/
├── api/                           # External API integrations
│   ├── ai/
│   │   ├── gemini.ts              # Gemini client
│   │   ├── prompts.ts             # AI prompt templates
│   │   └── types.ts               # AI types
│   └── geo/
│       ├── overpass.ts            # OSM Overpass API
│       ├── utils.ts               # Geo utilities
│       └── types.ts               # Geo types
│
├── assets/
│   └── styles/
│       └── main.css               # Main stylesheet
│
├── components/
│   ├── quest/
│   │   ├── QuestGenerator.vue     # Quest creation form
│   │   ├── TaskCard.vue           # Current task display
│   │   ├── PhotoCapture.vue       # Camera/upload
│   │   ├── FeedbackModal.vue      # AI feedback modal
│   │   └── ProgressIndicator.vue  # Progress bar
│   │
│   ├── rewards/
│   │   ├── CompletionScreen.vue   # Quest completion
│   │   ├── BadgeDisplay.vue       # Badge showcase
│   │   └── StatsCard.vue          # Statistics card
│   │
│   ├── map/                       # Map components (optional)
│   │   ├── QuestMap.vue           # Main map
│   │   └── MapMarker.vue          # Map marker
│   │
│   └── ui/                        # Reusable UI components
│       ├── AppButton.vue          # Button
│       ├── AppCard.vue            # Card
│       ├── AppLoader.vue          # Loading spinner
│       ├── AppModal.vue           # Modal
│       └── AppSlider.vue          # Slider input
│
├── composables/
│   ├── useQuest.ts                # Quest logic
│   ├── useGeolocation.ts          # Geolocation
│   ├── useCamera.ts               # Camera handling
│   └── useAI.ts                   # AI integration
│
├── config/
│   ├── constants.ts               # App constants
│   ├── env.ts                     # Env variables
│   └── features.ts                # Feature flags
│
├── i18n/
│   ├── index.ts                   # i18n setup
│   └── locales/
│       ├── de.json                # German (primary)
│       └── en.json                # English (future)
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts              # Supabase client
│   │   ├── database.ts            # DB operations
│   │   ├── storage.ts             # File storage
│   │   └── types.ts               # Supabase types
│   │
│   ├── logger/
│   │   ├── index.ts               # Logger setup
│   │   └── console.ts             # Console logger
│   │
│   └── utils/
│       ├── validators.ts          # Validation functions
│       ├── formatters.ts          # Formatting utilities
│       └── helpers.ts             # Helper functions
│
├── router/
│   ├── index.ts                   # Router setup
│   ├── routes.ts                  # Route definitions
│   └── guards.ts                  # Navigation guards
│
├── stores/
│   ├── index.ts                   # Pinia setup
│   ├── quest.ts                   # Quest store
│   └── ui.ts                      # UI state
│
├── types/
│   ├── index.ts                   # Type exports
│   ├── quest.ts                   # Quest types
│   ├── task.ts                    # Task types
│   ├── poi.ts                     # POI types
│   └── api.ts                     # API types
│
├── views/
│   ├── HomeView.vue               # Home page
│   ├── QuestSetupView.vue         # Quest setup
│   ├── QuestActiveView.vue        # Active quest
│   └── RewardsView.vue            # Rewards screen
│
├── App.vue                        # Root component
├── main.ts                        # Entry point
└── vite-env.d.ts                  # Vite types
```

---

### `/supabase` - Backend Configuration

```
supabase/
├── functions/                     # Edge Functions
│   ├── generate-quest/
│   │   └── index.ts               # Quest generation endpoint
│   │
│   ├── validate-photo/
│   │   └── index.ts               # Photo validation endpoint
│   │
│   └── _shared/
│       ├── ai-client.ts           # Shared AI client
│       ├── cors.ts                # CORS headers
│       └── logger.ts              # Function logger
│
└── migrations/
    ├── 20260212000001_initial.sql # Initial schema
    └── 20260212000002_indexes.sql # Indexes & RLS
```

---

### `/docs` - Documentation

```
docs/
├── README.md                      # Docs index
├── PHILOSOPHY.md                  # Project philosophy
├── ARCHITECTURE.md                # System architecture
├── API.md                         # API documentation
├── DATABASE.md                    # DB schema
└── TROUBLESHOOTING.md             # Common issues
```

---

## 📋 PART 2: STEP-BY-STEP IMPLEMENTATION PLAN

### Day 1: Project Setup & Foundation

#### Step 1.1: Package Configuration
```
□ Create package.json
  - Dependencies: Vue 3, TypeScript, Vite, Tailwind, Supabase, Pinia
  - Scripts: dev, build, lint, type-check
  
  Validate: pnpm install
```

#### Step 1.2: TypeScript Configuration
```
□ Create tsconfig.json
  - Strict mode enabled
  - Path aliases (@/ → src/)
  - Vue support
  
  Validate: pnpm type-check
```

#### Step 1.3: Build Tool Configuration
```
□ Create vite.config.ts
  - Vue plugin
  - Path aliases
  - Build optimization
  
  Validate: pnpm build
```

#### Step 1.4: Tailwind Setup
```
□ Create tailwind.config.ts
  - Custom colors (primary, success, warning, error)
  - Content paths
  
□ Create postcss.config.js
  
□ Create src/assets/styles/main.css
  - Tailwind directives
  
  Validate: pnpm dev (check styles work)
```

#### Step 1.5: Environment Setup
```
□ Create .env.example
  - Supabase URL/key
  - Gemini API key
  - Feature flags
  
□ Create .env.local (user creates, not in git)
  
□ Create src/config/env.ts
  - Type-safe env access
  
  Validate: console.log(import.meta.env)
```

#### Step 1.6: Linting & Formatting
```
□ Create .eslintrc.cjs
  - Vue 3 + TypeScript rules
  
□ Create .prettierrc
  - Consistent formatting
  
  Validate: pnpm lint
```

---

### Day 1: Core Infrastructure

#### Step 1.7: Supabase Integration
```
□ Create src/lib/supabase/client.ts
  - Initialize Supabase client
  - Export typed client
  
  Validate: Check connection (no errors)
```

#### Step 1.8: Database Schema
```
□ Create supabase/migrations/20260212000001_initial.sql
  - Tables: quests, quest_attempts, photos
  - RLS policies
  
  Validate: Run migration in Supabase dashboard
```

#### Step 1.9: Router Setup
```
□ Create src/router/routes.ts
  - Define routes
  
□ Create src/router/index.ts
  - Setup Vue Router
  
□ Create src/views/HomeView.vue (minimal)
  - Just "PhotoQuest" heading
  
  Validate: pnpm dev → see home page
```

#### Step 1.10: i18n Setup
```
□ Create src/i18n/index.ts
  - Setup vue-i18n
  
□ Create src/i18n/locales/de.json
  - Initial German strings
  
  Validate: Use $t() in component, check translation works
```

#### Step 1.11: Main Entry
```
□ Create src/main.ts
  - Mount Vue app
  - Register router, i18n, Pinia
  
□ Create src/App.vue
  - RouterView only
  
  Validate: pnpm dev → no errors
```

---

### Day 2: AI & API Integration

#### Step 2.1: Gemini Client
```
□ Create src/api/ai/gemini.ts
  - Initialize Gemini client
  - Export generateContent function
  
  Validate: Test with simple prompt
```

#### Step 2.2: AI Prompts
```
□ Create src/api/ai/prompts.ts
  - QUEST_GENERATION_PROMPT
  - PHOTO_VERIFICATION_PROMPT
  - Export as constants
  
  Validate: Review prompt format
```

#### Step 2.3: Overpass API Client
```
□ Create src/api/geo/overpass.ts
  - fetchPOIs function
  - Parse Overpass response
  
  Validate: Test with Oelsnitz coordinates
```

#### Step 2.4: Supabase Edge Function - Generate Quest
```
□ Create supabase/functions/generate-quest/index.ts
  - Accept: city, duration, difficulty, genre
  - Call Overpass → get POIs
  - Call Gemini → generate tasks
  - Return quest object
  
  Validate: Deploy + test with Postman/curl
```

#### Step 2.5: Supabase Edge Function - Validate Photo
```
□ Create supabase/functions/validate-photo/index.ts
  - Accept: taskDescription, photoBase64
  - Call Gemini Vision
  - Return: success, confidence, feedback
  
  Validate: Deploy + test with sample image
```

---

### Day 2: Quest Components

#### Step 2.6: Quest Store
```
□ Create src/stores/quest.ts
  - State: currentQuest, currentTaskIndex, score
  - Actions: createQuest, submitPhoto, nextTask
  
  Validate: Import in component, check reactivity
```

#### Step 2.7: Quest Generator Component
```
□ Create src/components/quest/QuestGenerator.vue
  - 4 inputs: duration, transport, difficulty, genre
  - Submit button
  - Call Edge Function
  
  Validate: pnpm dev → form renders
```

#### Step 2.8: Quest Setup View
```
□ Create src/views/QuestSetupView.vue
  - Use QuestGenerator component
  - Handle quest creation
  - Navigate to active quest
  
  Validate: Full flow works
```

#### Step 2.9: Task Card Component
```
□ Create src/components/quest/TaskCard.vue
  - Display: title, description, location, points
  - Photo button
  
  Validate: Render with mock data
```

#### Step 2.10: Photo Capture Component
```
□ Create src/components/quest/PhotoCapture.vue
  - <input type="file" capture="environment">
  - Preview
  - Submit
  
  Validate: Take photo, see preview
```

---

### Day 2-3: Active Quest Flow

#### Step 2.11: Feedback Modal
```
□ Create src/components/quest/FeedbackModal.vue
  - Show AI feedback
  - Success/failure styling
  - Hint display
  - Next/Retry buttons
  
  Validate: Show with mock feedback
```

#### Step 2.12: Progress Indicator
```
□ Create src/components/quest/ProgressIndicator.vue
  - Show: 3/5 tasks completed
  - Progress bar visual
  
  Validate: Update progress, see changes
```

#### Step 2.13: Active Quest View
```
□ Create src/views/QuestActiveView.vue
  - TaskCard
  - PhotoCapture
  - FeedbackModal
  - ProgressIndicator
  - Quest flow logic
  
  Validate: Complete full task cycle
```

---

### Day 3: Rewards & Polish

#### Step 3.1: Badge System
```
□ Create src/types/reward.ts
  - Badge interface
  
□ Create src/components/rewards/BadgeDisplay.vue
  - Show earned badges
  
  Validate: Display sample badges
```

#### Step 3.2: Stats Card
```
□ Create src/components/rewards/StatsCard.vue
  - Duration, tasks completed, score
  
  Validate: Show with mock data
```

#### Step 3.3: Completion Screen
```
□ Create src/components/rewards/CompletionScreen.vue
  - Congratulations message
  - BadgeDisplay
  - StatsCard
  - Download certificate button
  
  Validate: Full completion flow
```

#### Step 3.4: Rewards View
```
□ Create src/views/RewardsView.vue
  - CompletionScreen
  - Share button (Web Share API)
  - New quest button
  
  Validate: Navigate after quest completion
```

#### Step 3.5: UI Components
```
□ Create src/components/ui/AppButton.vue
  - Variants: primary, secondary
  - Sizes: large, medium
  
□ Create src/components/ui/AppLoader.vue
  - Loading spinner
  
□ Create src/components/ui/AppModal.vue
  - Reusable modal
  
  Validate: Use in various places
```

---

### Day 3: Final Polish

#### Step 3.6: Home View Enhancement
```
□ Update src/views/HomeView.vue
  - Welcome message
  - "Start new quest" button
  - How it works section
  
  Validate: Professional landing page
```

#### Step 3.7: Error Handling
```
□ Create src/lib/logger/index.ts
  - Error logging
  
□ Add error boundaries to key components
  
  Validate: Trigger error, see graceful handling
```

#### Step 3.8: Responsive Design
```
□ Review all components for mobile
  - Touch-friendly buttons (min 44px)
  - Responsive layouts
  - Test on mobile viewport
  
  Validate: Chrome DevTools mobile view
```

#### Step 3.9: Documentation
```
□ Create README.md
  - Setup instructions
  - Environment variables
  - Development commands
  
□ Create docs/TROUBLESHOOTING.md
  - Common issues list
  
  Validate: Follow README to setup fresh
```

#### Step 3.10: Deployment
```
□ Commit all code
□ Push to GitHub
□ Connect to Vercel
□ Add environment variables in Vercel
□ Deploy
  
  Validate: Visit live URL, test full flow
```

---

## 📦 KEY FILES WITH EXAMPLES

### Example 1: `package.json`

```json
{
  "name": "photoquest",
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext .vue,.ts --fix",
    "type-check": "vue-tsc --noEmit"
  },
  "dependencies": {
    "vue": "^3.4.21",
    "vue-router": "^4.3.0",
    "pinia": "^2.1.7",
    "@supabase/supabase-js": "^2.39.8",
    "@google/generative-ai": "^0.2.1",
    "vue-i18n": "^9.10.1"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^5.0.4",
    "typescript": "^5.4.2",
    "vue-tsc": "^2.0.6",
    "vite": "^5.1.5",
    "tailwindcss": "^3.4.1",
    "autoprefixer": "^10.4.18",
    "postcss": "^8.4.35",
    "eslint": "^8.57.0",
    "eslint-plugin-vue": "^9.22.0",
    "@typescript-eslint/eslint-plugin": "^7.1.1",
    "prettier": "^3.2.5"
  }
}
```

---

### Example 2: `src/main.ts`

```typescript
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'
import router from './router'
import App from './App.vue'
import './assets/styles/main.css'

// i18n setup
import de from './i18n/locales/de.json'

const i18n = createI18n({
  legacy: false,
  locale: 'de',
  messages: { de }
})

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(i18n)

app.mount('#app')
```

---

### Example 3: `src/components/ui/AppButton.vue`

```vue
<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary'
  size?: 'large' | 'medium'
  disabled?: boolean
}

withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'large',
  disabled: false
})
</script>

<template>
  <button
    :class="[
      'rounded-lg font-medium transition-colors',
      variant === 'primary' && 'bg-primary text-white hover:bg-blue-600',
      variant === 'secondary' && 'bg-gray-200 text-gray-800 hover:bg-gray-300',
      size === 'large' && 'px-8 py-4 text-lg',
      size === 'medium' && 'px-6 py-3 text-base',
      disabled && 'opacity-50 cursor-not-allowed'
    ]"
    :disabled="disabled"
  >
    <slot />
  </button>
</template>
```

---

### Example 4: `src/i18n/locales/de.json`

```json
{
  "home": {
    "title": "PhotoQuest Oelsnitz",
    "subtitle": "Entdecke deine Stadt durch KI-generierte Foto-Abenteuer",
    "startButton": "Neues Abenteuer starten"
  },
  "setup": {
    "title": "Dein Abenteuer anpassen",
    "duration": "Dauer",
    "transport": "Fortbewegung",
    "difficulty": "Schwierigkeit",
    "genre": "Genre",
    "createButton": "Quest erstellen"
  },
  "quest": {
    "photoButton": "📸 Foto machen",
    "submitButton": "Senden",
    "nextButton": "Weiter zum nächsten",
    "hintButton": "💡 Tipp anzeigen"
  },
  "completion": {
    "title": "Quest abgeschlossen! 🎉",
    "subtitle": "Großartige Arbeit!"
  }
}
```

---

## 🎯 PRIORITY LEVELS

### 🟥 MUST HAVE (Day 1-2)
- Core configuration files
- Supabase setup
- AI integration (Gemini)
- Quest generation flow
- Photo validation
- Basic UI components

### 🟨 SHOULD HAVE (Day 3)
- Rewards system
- Polish & responsive
- Error handling
- Documentation

### 🟩 NICE TO HAVE (Post-MVP)
- Map integration
- Advanced analytics
- Multiple cities
- Social features

---

## ✅ VALIDATION COMMANDS QUICK REFERENCE

| After changing...        | Run this...           | Expected result...                    |
|--------------------------|-----------------------|---------------------------------------|
| package.json             | `pnpm install`        | Dependencies installed                |
| TypeScript files         | `pnpm type-check`     | No type errors                        |
| Components/views         | `pnpm dev`            | Page renders at localhost:5173        |
| Config files             | `pnpm build`          | Build succeeds                        |
| Multiple files           | `pnpm lint`           | No lint errors                        |
| .env files               | Restart dev server    | New env vars available                |
| Supabase migrations      | Run in dashboard      | Tables created                        |
| Edge functions           | `supabase deploy`     | Functions deployed                    |

---

## 🚀 READY TO START

This structure is optimized for:
- ✅ Step-by-step development with Claude
- ✅ Max 200 lines per file
- ✅ Clear validation at each step
- ✅ English docs/code, German UI
- ✅ Balanced examples + instructions

**Next Step:** Load this file + PHILOSOPHY.md + PhotoQuest_TZ.md into Claude Projects, then say "Let's start Day 1"
