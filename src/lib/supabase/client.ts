import { createClient } from '@supabase/supabase-js'
import { env } from '@/config/env'

// Initialize the Supabase client
// The types for the database can be added here once generated
export const supabase = createClient(
  env.supabase.url,
  env.supabase.anonKey
)

// Export a helper to check the connection
export const checkSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase.from('quests').select('count', { count: 'exact', head: true })
    if (error) throw error
    return { success: true, data }
  } catch (err) {
    console.error('Supabase connection error:', err)
    return { success: false, error: err }
  }
}
