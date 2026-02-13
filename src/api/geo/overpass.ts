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
export const fetchPOIs = async (lat: number, lon: number, radius = 1000): Promise<POI[]> => {
  // Simplified query for better performance
  const query = `
    [out:json][timeout:15];
    (
      node["historic"](around:${radius},${lat},${lon});
      node["tourism"](around:${radius},${lat},${lon});
      way["historic"](around:${radius},${lat},${lon});
    );
    out center;
  `

  const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`

  try {
    const controller = new AbortController()
    const id = setTimeout(() => controller.abort(), 10000) // 10s timeout

    const response = await fetch(url, { signal: controller.signal })
    clearTimeout(id)

    if (!response.ok) throw new Error('Overpass API request failed')

    const data = await response.json()
    
    if (!data.elements || data.elements.length === 0) {
      console.warn('Overpass returned 0 results, using fallback.')
      return FALLBACK_POIS
    }

    return data.elements.map((el: any) => ({
      id: el.id,
      lat: el.lat || el.center.lat,
      lon: el.lon || el.center.lon,
      name: el.tags.name || el.tags.description || `POI ${el.id}`,
      type: el.tags.historic || el.tags.tourism || el.tags.amenity || 'point_of_interest'
    })).filter((poi: POI) => poi.name)
  } catch (error) {
    console.error('Failed to fetch POIs, using fallback:', error)
    return FALLBACK_POIS
  }
}
