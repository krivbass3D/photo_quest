import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import i18n from './i18n'
import pinia from './stores'
import './assets/styles/main.css'
import { checkSupabaseConnection } from '@/lib/supabase/client'

// PhotoQuest Main Entry Point
const app = createApp(App)

app.use(router)
app.use(i18n)
app.use(pinia)
app.mount('#app')

// Validate Supabase Connection
checkSupabaseConnection().then(({ success, error }) => {
  if (success) {
    console.log('✅ Supabase connected successfully')
  } else {
    console.warn('❌ Supabase connection failed. Check your credentials in .env.local')
    console.error(error)
  }
})
