import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export type QuestDifficulty = 'easy' | 'medium' | 'hard' | 'expert'
export type QuestFormat = 'solo' | 'couple' | 'small_group' | 'family' | 'corporate' | 'teens'
export type QuestAudience = 'tourist' | 'local' | 'couple' | 'family' | 'friends' | 'colleagues' | 'teens' | 'universal'
export type QuestGenre = 'detective' | 'history' | 'adventure' | 'mystery' | 'crime' | 'romance' | 'fantasy' | 'thriller' | 'comedy' | 'postapoc'
export type QuestLinearity = 'linear' | 'branching' | 'open'
export type QuestLanguage = 'ru' | 'de' | 'en' | 'uk'

export interface QuestConfigState {
  // Block 1: Basic
  city: string
  lat: number
  lon: number
  duration: number
  difficulty: QuestDifficulty
  playersFormat: QuestFormat
  audience: QuestAudience
  
  // Block 2: Atmosphere
  genre: QuestGenre
  atmosphere: string[]
  
  // Block 3: Mechanics
  taskTypes: string[]
  linearity: QuestLinearity
  
  // Block 4: Language
  language: QuestLanguage
}

export const useQuestConfigStore = defineStore('questConfig', () => {
  const config = ref<QuestConfigState>({
    city: '',
    lat: 0,
    lon: 0,
    duration: 60,
    difficulty: 'medium',
    playersFormat: 'couple',
    audience: 'tourist',
    genre: 'history',
    atmosphere: [],
    taskTypes: [],
    linearity: 'linear',
    language: 'ru' // Defaulting to Russian as per prompt examples, or English? User prompt had Russian examples.
  })

  // Live Preview Logic (Rule-based)
  const previewText = computed(() => {
    const { city, genre, audience, duration } = config.value
    const cityText = city || 'Unknown City'
    
    // Simple template generation
    return `An immersive ${duration}-minute ${genre} experience in ${cityText} designed for a ${audience}. Explore hidden gems and solve photo-mysteries.`
  })

  function setCity(cityName: string) {
    config.value.city = cityName
  }

  function setCoordinates(lat: number, lon: number) {
    config.value.lat = lat
    config.value.lon = lon
  }

  function applyTemplate(templateName: string) {
    // Logic to apply presets
    switch(templateName) {
      case 'romantic':
        config.value.genre = 'romance'
        config.value.audience = 'couple'
        config.value.atmosphere = ['romantic', 'mysterious']
        break
        // ... other cases
    }
  }

  return {
    config,
    previewText,
    setCity,
    setCoordinates,
    applyTemplate
  }
})
