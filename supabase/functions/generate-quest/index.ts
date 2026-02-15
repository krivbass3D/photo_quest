import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { city, duration, transport, difficulty, genre, playersFormat, audience, atmosphere, taskTypes, linearity, language, pois } = await req.json()
    
    // Validate inputs
    if (!city || !pois || !Array.isArray(pois)) {
      throw new Error('Missing city or POI data')
    }

    const openaiKey = Deno.env.get('VITE_OPENAI_API_KEY')
    if (!openaiKey) throw new Error('VITE_OPENAI_API_KEY not set in Supabase Secrets')

    // AI Configuration
    const systemPrompt = `Ты профессиональный квест-дизайнер.
1. Твоя задача: Создавать увлекательные городские фото-квесты.
2. Формат: JSON.
3. Язык: Строго следуй запрошенному языку (по умолчанию Русский, но если указан другой - пиши на нем).
4. Структура:
   - Введение (intro): Погружает в атмосферу.
   - Задания: Разделены на нарратив (история) и инструкцию (что делать).
5. Контент:
   - Используй предоставленные POI.
   - Если POI мало, используй общие городские элементы.
   - Тон должен соответствовать жанру.`

    // Prepare POI context (limit to 10 nearest/most relevant)
    const poiContext = pois.slice(0, 10).map(p => `- ${p.name} (${p.type || 'unknown'})`).join('\n')

    const targetLanguage = language === 'en' ? 'English' : language === 'de' ? 'German' : 'Russian'

    const userPrompt = `Create a city quest in ${targetLanguage}.

City: ${city}
Duration: ${duration} min
Difficulty: ${difficulty}
Genre: ${genre}
Atmosphere: ${Array.isArray(atmosphere) ? atmosphere.join(', ') : (atmosphere || 'Standard')}
Language: ${targetLanguage} (IMPORTANT: Write EVERYTHING in this language)

AVAILABLE POIS:
${poiContext}

JSON OUTPUT FORMAT:
{
  "theme": "Quest Title",
  "intro": "Atmospheric introduction story (2-3 sentences)",
  "tasks": [
    {
      "id": "task-1",
      "title": "Step Title",
      "narrative": "Story part: 'You arrive at the ancient gates...'",
      "instruction": "Task part: 'Find the stone lion and take a photo of it.'",
      "description": "Legacy field: Combine narrative and instruction here",
      "hint": "Helpful hint",
      "location": "POI Name or Location",
      "points": 100
    }
  ]
}`

    console.log('Sending request to OpenAI API...')
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // or gpt-4-turbo if needed for better logic
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.7
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('OpenAI Error:', errorText)
      throw new Error(`OpenAI Error (${response.status})`)
    }

    const data = await response.json()
    const resultText = data.choices[0].message.content
    
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
