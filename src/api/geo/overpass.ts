/**
 * Overpass API integration for fetching POIs from OpenStreetMap
 */

export interface POI {
  id: number
  lat: number
  lon: number
  name: string
  type: string
}

/**
 * Fallback POIs for Deutschland (Demo: Oelsnitz) in case API is down
 */
const FALLBACK_POIS: POI[] = [
  { id: 1, lat: 50.415, lon: 12.169, name: "St.-Jakobi-Kirche", type: "church" },
  { id: 2, lat: 50.413, lon: 12.162, name: "Schloss Voigtsberg", type: "castle" },
  { id: 3, lat: 50.416, lon: 12.167, name: "Marktplatz", type: "square" },
  { id: 4, lat: 50.417, lon: 12.168, name: "Rathaus", type: "amenity" },
  { id: 5, lat: 50.412, lon: 12.170, name: "Stadtpark", type: "park" }
]

/**
 * Fetch Points of Interest around a specific location
 */
/**
 * Fetch Points of Interest around a specific location
 */
export const fetchPOIs = async (lat: number, lon: number, radius = 800): Promise<POI[]> => {
  // Optimized query:
  // 1. Reduced timeout to 10s (fail fast)
  // 2. Focused on specific tags to reduce data load
  // 3. Using 'nwr' (Node, Way, Relation) to catch buildings
  const query = `
    [out:json][timeout:10];
    (
      nwr["tourism"~"attraction|viewpoint|museum|artwork|gallery"](around:${radius},${lat},${lon});
      nwr["historic"~"monument|memorial|castle|ruins|building"](around:${radius},${lat},${lon});
      nwr["amenity"~"place_of_worship|townhall|theatre"](around:${radius},${lat},${lon});
    );
    out center 15; // Limit to 15 results to save bandwidth
  `
  
  // Use a public instance with better uptime if standard one fails, or rotate? 
  // For now stick to main but handle timeout gracefully.
  const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`

  try {
    const controller = new AbortController()
    const id = setTimeout(() => controller.abort(), 12000) // 12s client timeout

    const response = await fetch(url, { signal: controller.signal })
    clearTimeout(id)

    if (!response.ok) throw new Error(`Overpass API error: ${response.status}`)

    const data = await response.json()
    
    if (!data.elements || data.elements.length === 0) {
      console.warn('Overpass returned 0 results, using fallback.')
      return FALLBACK_POIS
    }

    // Map and simple deduplication
    const pois = data.elements
      .map((el: any) => ({
        id: el.id,
        lat: el.lat || el.center?.lat || lat,
        lon: el.lon || el.center?.lon || lon,
        name: el.tags.name || el.tags.description,
        type: el.tags.tourism || el.tags.historic || el.tags.amenity || 'point_of_interest'
      }))
      .filter((p: any) => p.name && p.lat && p.lon) // Strict filter
      .slice(0, 10) // Keep only top 10

    return pois.length > 0 ? pois : FALLBACK_POIS

  } catch (error) {
    console.warn('⚠️ Overpass API timed out or failed. Switching to offline/fallback mode.', error)
    // Return fallback data silently so the user flow isn't interrupted
    return FALLBACK_POIS
  }
}
