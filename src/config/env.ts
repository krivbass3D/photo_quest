export const env = {
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL as string,
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY as string,
  },
  ai: {
    geminiKey: import.meta.env.VITE_GEMINI_API_KEY as string,
    openaiKey: import.meta.env.VITE_OPENAI_API_KEY as string,
  },
  features: {
    enableMaps: import.meta.env.VITE_ENABLE_MAPS === 'true',
    debug: import.meta.env.VITE_DEBUG_MODE === 'true',
  },
}

// Validation (optional but recommended for dev)
if (!env.supabase.url || !env.supabase.anonKey) {
  console.warn('Supabase configuration is missing. Check your .env file.')
}
if (!env.ai.geminiKey) {
  console.warn('Gemini API key is missing. Check your .env file.')
}
