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
    const systemPrompt = `Ты профессиональный квест-дизайнер и сценарист городских игр.

1.  Создавай логичные, атмосферные и структурированные сценарии городских квестов, которые можно пройти в любом городе мира без реквизита и специальных предметов.
2.  Квест должен на 80% использовать фото-задания.
3.  Быть полностью автономным.
4.  Использовать только наблюдение, анализ, логику и элементы городской среды.

Структура обязательна:
1.  Название
2.  Введение
3.  Конфликт
4.  5–8 шагов (Каждый шаг: Нарратив, Задание, Ответ, Подсказка, Локация, Координаты)
5.  Финальный твист
6.  Альтернативная концовка

Задания должны быть разнообразными и соответствовать выбранным типам механик.`

    // Prepare POI context (limit to 10 nearest/most relevant)
    const poiContext = pois.slice(0, 10).map(p => `- ${p.name} (${p.type || 'unknown'})`).join('\n')

    const userPrompt = `Создай городской квест со следующими параметрами:

Город: ${city}
Продолжительность: ${duration} минут
Сложность: ${difficulty}
Формат игроков: ${playersFormat || 'Универсальный'}
Целевая аудитория: ${audience || 'Туристы'}
Жанр: ${genre}
Атмосфера: ${Array.isArray(atmosphere) ? atmosphere.join(', ') : (atmosphere || 'Standard')}
Типы заданий: ${Array.isArray(taskTypes) ? taskTypes.join(', ') : (taskTypes || 'Observation')}
Линейность: ${linearity || 'linear'}
Язык: ${language === 'en' ? 'English' : language === 'de' ? 'German' : 'Russian'}

ДОСТУПНЫЕ POI (Используй их как локации для заданий):
${poiContext}

Дополнительно:
- Квест должен быть полностью автономным.
- Основа это фото загадки.
- Использовать универсальные городские элементы, если POI недоступны.

AUSGABEFORMAT (JSON):
{
  "id": "generated-id",
  "theme": "Название Квеста",
  "tasks": [
    {
      "id": "task-1",
      "title": "Название шага",
      "description": "Нарратив + Задание (что найти/сделать)",
      "hint": "Подсказка",
      "location": "Название POI или ориентира",
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
