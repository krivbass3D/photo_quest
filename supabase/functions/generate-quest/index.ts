import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { city, duration, transport, difficulty, genre, pois } = await req.json()
    console.log('Input Payload:', { city, duration, transport, difficulty, genre, poiCount: pois?.length })
    
    // Validate inputs
    if (!city || !pois || !Array.isArray(pois)) {
      throw new Error('Missing city or POI data')
    }

    const openaiKey = Deno.env.get('VITE_OPENAI_API_KEY')
    if (!openaiKey) throw new Error('VITE_OPENAI_API_KEY not set in Supabase Secrets')

    const taskCount = Math.min(Math.max(Math.floor(duration / 20), 3), 7)
    
    // Prepare POI context for AI
    const poiContext = pois.slice(0, 10).map(p => `- ${p.name} (${p.type})`).join('\n')

    const prompt = `
      Du bist ein kreativer Reiseführer und Designer für Foto-Schnitzeljagden.
      Erstelle eine Quest für ${city}.
      
      ORTE:
      ${poiContext}
      
      PARAMETER:
      - Dauer: ${duration} Min
      - Transport: ${transport}
      - Schwierigkeit: ${difficulty}
      - Genre: ${genre}
      - Aufgaben: ${taskCount}
      
      AUSGABE NUR JSON (kein Markdown):
      {
        "id": "quest-unique-id",
        "theme": "Einprägsamer Name der Quest",
        "tasks": [
          {
            "id": "task-1",
            "title": "Titel",
            "description": "Was soll fotografiert werden?",
            "hint": "Tipp",
            "location": "Name des Ortes",
            "points": 100
          }
        ]
      }
    `

    console.log('Sending request to OpenAI API...')
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' }
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('OpenAI Error:', errorText)
      throw new Error(`OpenAI Error (${response.status})`)
    }

    const data = await response.json()
    const resultText = data.choices[0].message.content
    console.log('Generation Successful!')
    
    return new Response(resultText, {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    console.error('Final Function Error:', error.message)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
