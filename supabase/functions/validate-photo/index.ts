import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { taskDescription, location, photoBase64 } = await req.json()

    if (!taskDescription || !photoBase64) {
      throw new Error('Missing task description or photo data')
    }

    const openaiKey = Deno.env.get('VITE_OPENAI_API_KEY')
    if (!openaiKey) throw new Error('VITE_OPENAI_API_KEY not set in Supabase Secrets')

    const prompt = `
      Du bist ein hilfreicher KI-Assistent für eine Foto-Schnitzeljagd.
      AUFGABE: "${taskDescription}"
      STANDORT: ${location || 'Unbekannt'}
      
      Analysiere das Foto: Wurde die Aufgabe erfüllt?
      AUSGABE NUR JSON:
      {
        "success": true/false,
        "feedback": "Kurzes Feedback",
        "hint": "Optionaler Tipp"
      }
    `

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: prompt },
              {
                type: 'image_url',
                image_url: { url: `data:image/jpeg;base64,${photoBase64}` }
              }
            ]
          }
        ],
        response_format: { type: 'json_object' }
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`OpenAI Vision Error (${response.status}): ${errorText}`)
    }

    const data = await response.json()
    const resultText = data.choices[0].message.content

    return new Response(resultText, {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
