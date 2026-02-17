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
  radius: number // km
  userLat?: number | null
  userLon?: number | null
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
    radius: 3, // Default 3km
    userLat: null,
    userLon: null,
    duration: 60,
    difficulty: 'medium',
    playersFormat: 'couple',
    audience: 'tourist',
    genre: 'history',
    atmosphere: [],
    taskTypes: [],
    linearity: 'linear',
    language: 'ru' 
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
    // Reset user location when manually selecting a city to avoid confusion
    config.value.userLat = null
    config.value.userLon = null
  }

  function setCoordinates(lat: number, lon: number) {
    config.value.lat = lat
    config.value.lon = lon
  }

  function setUserLocation(lat: number, lon: number) {
    config.value.userLat = lat
    config.value.userLon = lon
    // Also set as main coordinates for now, but mark as user-derived if needed
    config.value.lat = lat
    config.value.lon = lon
  }

  function setRadius(radius: number) {
    config.value.radius = radius
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
    setUserLocation,
    setRadius,
    applyTemplate
  }
})
