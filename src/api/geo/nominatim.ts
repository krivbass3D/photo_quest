export interface NominatimResult {
  place_id: number
  licence: string
  osm_type: string
  osm_id: number
  boundingbox: string[]
  lat: string
  lon: string
  display_name: string
  class: string
  type: string
  importance: number
}

const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org/search'

export async function searchCity(query: string): Promise<NominatimResult[]> {
  if (!query || query.length < 3) return []

  try {
    const params = new URLSearchParams({
      q: query,
      format: 'json',
      addressdetails: '1',
      limit: '5',
      featuretype: 'city' // Bias towards cities
    })

    const response = await fetch(`${NOMINATIM_BASE_URL}?${params.toString()}`, {
      headers: {
        'Accept-Language': 'en-US,en;q=0.9', // Default to English for consistency or make dynamic
        'User-Agent': 'PhotoQuest-MVP/1.0' // Nominatim requires a User-Agent
      }
    })

    if (!response.ok) {
      throw new Error(`Nominatim error: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Failed to search city:', error)
    return []
  }
}
