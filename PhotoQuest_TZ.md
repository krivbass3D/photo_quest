# ТЕХНИЧЕСКОЕ ЗАДАНИЕ
## PhotoQuest - AI-генерируемые фотоквесты для городских экскурсий

---

## 📋 ИНФОРМАЦИЯ О ПРОЕКТЕ

### Контекст
**Pet-проект** для практики в INFORMA® GmbH & Co. KG (разработчик travus cloud®)  
**Цель**: Демонстрация навыков работы с технологическим стеком travus cloud  
**Технологии**: TypeScript, Vue 3, Supabase (вместо MongoDB/MariaDB), Vercel  
**AI**: Google Gemini 1.5 Flash (primary), GPT-4o mini (fallback)  
**Язык интерфейса**: Немецкий  
**Сроки**: 3 дня (MVP)  
**Город для тестирования**: Oelsnitz (Vogtl), Deutschland

---

## 🎯 СУТЬ ПРИЛОЖЕНИЯ

### Концепция
AI-агент генерирует персонализированные фотоквесты для городских экскурсий. Путешественники получают задания сфотографировать определенные достопримечательности, AI проверяет фотографии и дает фидбек.

### Пример задания
```
📍 Marktplatz, Oelsnitz
🎯 Задание: "Fotografiere das lauteste und höchste Objekt auf dem Marktplatz"
💡 Ожидаемый ответ: Часы на городской ратуше
✅ AI проверяет фото → принимает или дает подсказки
```

### Целевая аудитория
- Туристы, ищущие интерактивные экскурсии
- Местные жители, желающие по-новому открыть свой город
- Семьи с детьми (детский режим)

---

## 🎨 ПРИНЦИПЫ ДИЗАЙНА

### UI/UX Философия
**МИНИМАЛИЗМ** - главный принцип

**Экран должен содержать**:
- Только одно основное действие
- Максимум 2-3 элемента одновременно
- Большие touch-friendly кнопки (min 44x44px)
- Много белого пространства
- Четкая визуальная иерархия

**Запрещено**:
- ❌ Перегруженные экраны
- ❌ Множественные опции на одном экране
- ❌ Мелкий текст
- ❌ Сложная навигация
- ❌ Избыточная информация

**Цветовая палитра**:
```css
primary: #3B82F6    /* Синий - основные действия */
success: #10B981    /* Зеленый - успех */
warning: #F59E0B    /* Оранжевый - подсказки */
error: #EF4444      /* Красный - ошибки */
background: #FFFFFF /* Белый фон */
text: #1F2937       /* Темно-серый текст */
```

---

## ⚙️ ТЕХНИЧЕСКИЙ СТЕК

### Frontend
```json
{
  "framework": "Vue 3 Composition API + TypeScript",
  "build": "Vite",
  "styling": "Tailwind CSS 3.x",
  "routing": "Vue Router 4",
  "state": "Pinia (или ref/reactive для простых случаев)",
  "icons": "Heroicons или Lucide Vue",
  "components": "Собственные компоненты"
}
```

### Backend & Database
```json
{
  "database": "Supabase PostgreSQL",
  "storage": "Supabase Storage (для фото)",
  "auth": "Supabase Auth (анонимная)",
  "realtime": "Не требуется для MVP"
}
```

### AI Integration
```json
{
  "primary": "Google Gemini 1.5 Flash",
  "use_cases": [
    "Генерация квестов",
    "Проверка фотографий (vision)",
    "Генерация подсказок"
  ],
  "fallback": "GPT-4o mini (если Gemini недоступен)",
  "budget": "$0.50 на тестирование"
}
```

### Deployment
```json
{
  "hosting": "Vercel",
  "domain": "photoquest-oelsnitz.vercel.app",
  "environment": "Production",
  "env_vars": [
    "VITE_SUPABASE_URL",
    "VITE_SUPABASE_ANON_KEY",
    "VITE_GEMINI_API_KEY",
    "VITE_OPENAI_API_KEY"
  ]
}
```

---

## 📊 СТРУКТУРА БАЗЫ ДАННЫХ (SUPABASE)

### Таблица: quests
```sql
CREATE TABLE quests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  city TEXT NOT NULL,
  duration_minutes INTEGER NOT NULL,
  transport_mode TEXT NOT NULL,  -- 'walking' | 'public_transport'
  difficulty TEXT NOT NULL,      -- 'easy' | 'medium' | 'hard'
  genre TEXT NOT NULL,            -- 'history' | 'mystery' | 'kids'
  tasks JSONB NOT NULL,           -- Массив заданий
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Таблица: quest_attempts
```sql
CREATE TABLE quest_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quest_id UUID REFERENCES quests(id),
  user_id UUID,                   -- Анонимный ID из браузера
  status TEXT NOT NULL,           -- 'in_progress' | 'completed' | 'abandoned'
  current_task_index INTEGER DEFAULT 0,
  score INTEGER DEFAULT 0,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);
```

### Таблица: photos
```sql
CREATE TABLE photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  attempt_id UUID REFERENCES quest_attempts(id),
  task_index INTEGER NOT NULL,
  storage_path TEXT NOT NULL,     -- Путь в Supabase Storage
  ai_verified BOOLEAN DEFAULT FALSE,
  ai_feedback TEXT,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Структура Task (JSONB)
```typescript
interface Task {
  title: string;           // "Das Rathaus-Glockenspiel"
  description: string;     // Детальное описание
  hint: string;           // Подсказка при неудаче
  location: string;       // "Marktplatz, Oelsnitz"
  points: number;         // Очки за задание
}
```

---

## 🏗️ АРХИТЕКТУРА ПРИЛОЖЕНИЯ

### Высокоуровневая структура
```
/src
  /components
    /quest
      QuestGenerator.vue      # Форма создания квеста
      TaskCard.vue            # Карточка текущего задания
      PhotoCapture.vue        # Камера + загрузка
      FeedbackModal.vue       # Модалка с результатом AI
    /rewards
      CompletionScreen.vue    # Экран завершения
      BadgeDisplay.vue        # Отображение бейджей
    /ui
      Button.vue              # Переиспользуемая кнопка
      ProgressBar.vue         # Прогресс квеста
  /views
    HomeView.vue              # Главная страница
    QuestSetupView.vue        # Настройка параметров
    QuestActiveView.vue       # Активный квест
    RewardsView.vue           # Экран наград
  /lib
    /ai
      gemini.ts               # Gemini API клиент
      prompts.ts              # Шаблоны промптов
    /supabase
      client.ts               # Supabase клиент
      database.ts             # DB операции
      storage.ts              # Storage операции
    /utils
      validators.ts           # Валидация данных
      formatters.ts           # Форматирование
  /stores
    questStore.ts             # Pinia store для квестов
  /types
    index.ts                  # TypeScript типы
  /i18n
    de.json                   # Немецкие тексты
  App.vue
  main.ts
  router.ts
```

---

## 🔄 ПОЛЬЗОВАТЕЛЬСКИЙ FLOW

### Шаг 1: Создание квеста
```
1. Пользователь видит приветственный экран
2. Нажимает "Neues Abenteuer starten"
3. Видит 4 простых слайдера/селектора:
   - Dauer (30-180 min)
   - Transport (Zu Fuß / Öffentlich)
   - Schwierigkeit (Leicht / Mittel / Schwer)
   - Genre (Geschichte / Geheimnis / Kinder)
4. Нажимает "Quest erstellen"
5. Loader: "Dein Abenteuer wird erstellt..."
6. AI генерирует квест (5-7 заданий)
```

### Шаг 2: Прохождение квеста
```
1. Видит первое задание на полный экран:
   - Заголовок
   - Описание
   - Локация
   - Кнопка "Foto machen"
   
2. Нажимает кнопку → открывается камера
3. Делает фото → preview
4. Нажимает "Senden"
5. Loader: "Foto wird überprüft..."
6. AI анализирует фото

   ЕСЛИ УСПЕХ:
   - ✅ "Perfekt! +100 Punkte"
   - Короткая анимация
   - Кнопка "Weiter zum nächsten"
   
   ЕСЛИ НЕУДАЧА:
   - ❌ "Nicht ganz richtig"
   - Фидбек от AI
   - 💡 Кнопка "Tipp anzeigen" (если есть)
   - 🔄 "Nochmal versuchen"
```

### Шаг 3: Завершение
```
1. После последнего задания → экран "Quest abgeschlossen!"
2. Показ наград:
   - 🏆 Полученные бейджи
   - 📜 Кнопка "Zertifikat herunterladen"
   - 🖼️ "Fotocollage erstellen"
3. Опция "Teilen" (Web Share API)
4. "Neues Abenteuer starten"
```

---

## 🤖 AI ИНТЕГРАЦИЯ

### Промпт для генерации квеста
```typescript
const QUEST_GENERATION_PROMPT = `
Du bist ein kreativer Reiseführer und Quest-Designer.

AUFGABE: Erstelle eine Foto-Schnitzeljagd für ${city}.

PARAMETER:
- Dauer: ${duration} Minuten
- Transport: ${transport}
- Schwierigkeit: ${difficulty}
- Genre: ${genre}

ANFORDERUNGEN:
1. Erstelle ${taskCount} Aufgaben
2. Jede Aufgabe soll kreativ und interessant sein
3. Aufgaben sollten nicht zu offensichtlich sein (außer bei "Leicht")
4. Berücksichtige die Gehzeit zwischen Orten
5. Genre-Ton durchziehen (z.B. mysteriös für "Geheimnis")

AUSGABEFORMAT (nur JSON, keine Erklärungen):
{
  "tasks": [
    {
      "title": "Kurzer prägnanter Titel",
      "description": "Detaillierte Beschreibung der Aufgabe (2-3 Sätze)",
      "hint": "Hilfreicher Hinweis falls nötig",
      "location": "Ungefährer Standort",
      "points": 100
    }
  ]
}

WICHTIG: Antworte NUR mit dem JSON-Objekt, ohne Markdown oder Text drumherum.
`;
```

### Промпт для проверки фото
```typescript
const PHOTO_VERIFICATION_PROMPT = `
Du bist ein hilfreicher KI-Assistent für eine Foto-Schnitzeljagd.

AUFGABE DES BENUTZERS:
"${task.description}"

STANDORT: ${task.location}

Analysiere das hochgeladene Foto und entscheide:
1. Hat der Benutzer die Aufgabe korrekt erfüllt?
2. Ist das richtige Objekt/Gebäude auf dem Foto?

AUSGABEFORMAT (nur JSON):
{
  "success": true/false,
  "feedback": "Kurzes Feedback (1-2 Sätze)",
  "hint": "Optionaler Tipp wenn success=false, sonst null"
}

RICHTLINIEN:
- Sei großzügig und ermutigend
- Bei Zweifeln: eher akzeptieren
- Feedback soll freundlich und konstruktiv sein
- Bei Erfolg: kurz gratulieren
- Bei Misserfolg: erklären warum, nicht entmutigen

WICHTIG: Antworte NUR mit JSON, ohne Markdown.
`;
```

---

## 🎁 СИСТЕМА ВОЗНАГРАЖДЕНИЙ

### Типы наград (для MVP)

#### 1. Digitale Abzeichen (Бейджи)
```typescript
interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  condition: 'quest_complete' | 'perfect_score' | 'speed_run';
}

const BADGES = [
  {
    id: 'explorer',
    name: 'Oelsnitz-Entdecker',
    icon: '🗺️',
    description: 'Erste Quest abgeschlossen',
    condition: 'quest_complete'
  },
  {
    id: 'photographer',
    name: 'Meisterfotograf',
    icon: '📸',
    description: 'Alle Fotos beim ersten Versuch richtig',
    condition: 'perfect_score'
  },
  {
    id: 'speedrunner',
    name: 'Blitzschnell',
    icon: '⚡',
    description: 'Quest in unter 60 Minuten beendet',
    condition: 'speed_run'
  }
];
```

#### 2. Zertifikat (PDF Certificate)
```typescript
// Генерируется через браузерный print → PDF
interface Certificate {
  userName: string;        // Опционально
  city: string;
  completedAt: Date;
  duration: string;
  tasksCompleted: number;
  score: number;
  badges: Badge[];
}

// Простой HTML шаблон → window.print()
```

#### 3. Fotocollage (опционально)
```typescript
// Коллаж из всех фото квеста
// Используем canvas API для создания
// Скачивается как PNG
```

#### 4. Freigeschaltete Inhalte
```typescript
// После завершения квеста разблокируются:
const UNLOCKED_CONTENT = [
  "Historische Fakten über Oelsnitz",
  "Geheime Geschichten der Orte",
  "Nächster Schwierigkeitsgrad verfügbar"
];
```

---

## 📝 ПОЛНЫЙ СПИСОК ТЕКСТОВ ИНТЕРФЕЙСА (НЕМЕЦКИЙ)

### Home Screen
```json
{
  "welcome_title": "PhotoQuest Oelsnitz",
  "welcome_subtitle": "Entdecke deine Stadt durch KI-generierte Foto-Abenteuer",
  "start_button": "Neues Abenteuer starten",
  "how_it_works": "Wie funktioniert's?",
  "step_1": "Wähle deine Vorlieben",
  "step_2": "KI erstellt deine Quest",
  "step_3": "Fotografiere Sehenswürdigkeiten",
  "step_4": "Sammle Abzeichen & Punkte"
}
```

### Quest Setup
```json
{
  "setup_title": "Dein Abenteuer anpassen",
  "duration_label": "Dauer",
  "duration_30": "30 Minuten",
  "duration_60": "60 Minuten",
  "duration_90": "90 Minuten",
  "duration_120": "120 Minuten",
  "duration_180": "180 Minuten",
  
  "transport_label": "Fortbewegung",
  "transport_walking": "Zu Fuß",
  "transport_public": "Öffentliche Verkehrsmittel",
  
  "difficulty_label": "Schwierigkeit",
  "difficulty_easy": "Leicht",
  "difficulty_medium": "Mittel",
  "difficulty_hard": "Schwer",
  
  "genre_label": "Genre",
  "genre_history": "Geschichte",
  "genre_mystery": "Geheimnis",
  "genre_kids": "Für Kinder",
  
  "create_button": "Quest erstellen",
  "creating_loader": "Dein Abenteuer wird erstellt..."
}
```

### Active Quest
```json
{
  "task_label": "Aufgabe",
  "location_label": "Standort",
  "points_label": "Punkte",
  "progress_label": "Fortschritt",
  
  "photo_button": "📸 Foto machen",
  "submit_button": "Senden",
  "retake_button": "Neu aufnehmen",
  "hint_button": "💡 Tipp anzeigen",
  "skip_button": "Überspringen",
  "next_button": "Weiter zum nächsten",
  
  "verifying_loader": "Foto wird überprüft...",
  "success_title": "Perfekt! ✅",
  "success_points": "+{points} Punkte",
  "failure_title": "Nicht ganz richtig ❌",
  "hint_revealed": "Tipp:",
  
  "quit_confirm": "Quest wirklich beenden?",
  "quit_yes": "Ja, beenden",
  "quit_no": "Weitermachen"
}
```

### Completion Screen
```json
{
  "completion_title": "Quest abgeschlossen! 🎉",
  "completion_subtitle": "Großartige Arbeit!",
  
  "stats_duration": "Dauer",
  "stats_tasks": "Aufgaben",
  "stats_score": "Gesamtpunktzahl",
  
  "badges_title": "Verdiente Abzeichen",
  "no_badges": "Keine Abzeichen dieses Mal",
  
  "rewards_title": "Deine Belohnungen",
  "download_certificate": "📜 Zertifikat herunterladen",
  "create_collage": "🖼️ Fotocollage erstellen",
  "share_button": "✨ Teilen",
  
  "unlocked_title": "Freigeschaltet",
  "unlocked_history": "Historische Fakten",
  "unlocked_stories": "Geheime Geschichten",
  "unlocked_difficulty": "Neue Schwierigkeitsstufe",
  
  "new_quest_button": "Neues Abenteuer starten",
  "home_button": "Zur Startseite"
}
```

### Errors
```json
{
  "error_network": "Netzwerkfehler. Bitte prüfe deine Verbindung.",
  "error_photo_upload": "Foto konnte nicht hochgeladen werden.",
  "error_ai_timeout": "KI antwortet nicht. Bitte später versuchen.",
  "error_quest_generation": "Quest konnte nicht erstellt werden.",
  "error_camera": "Kamera konnte nicht geöffnet werden.",
  
  "retry_button": "Erneut versuchen",
  "cancel_button": "Abbrechen"
}
```

---

## 📋 ПРИМЕРЫ ГОТОВЫХ ЗАДАНИЙ

### Пример 1 (Leicht, Geschichte)
```json
{
  "title": "Das Wahrzeichen von Oelsnitz",
  "description": "Finde das bekannteste Gebäude im Stadtzentrum und fotografiere seine Hauptfassade. Es ist ein historisches Gebäude mit einem Turm.",
  "hint": "Schaue auf dem Marktplatz. Das Gebäude hat eine Uhr.",
  "location": "Marktplatz, Oelsnitz",
  "points": 100
}
```

### Пример 2 (Mittel, Geheimnis)
```json
{
  "title": "Der vergessene Zeitzeuge",
  "description": "Irgendwo in der Altstadt steht ein Denkmal, das an ein wichtiges Ereignis erinnert. Es ist aus Stein und hat eine Inschrift. Finde es und fotografiere die Inschrift.",
  "hint": "In der Nähe der Kirche gibt es einen kleinen Platz mit alten Bäumen.",
  "location": "Altstadt, Oelsnitz",
  "points": 150
}
```

### Пример 3 (Kinder, Schwer)
```json
{
  "title": "Das bunte Wunder",
  "description": "Finde das Gebäude mit den meisten verschiedenen Farben! Es sieht fröhlich aus und Kinder besuchen es oft.",
  "hint": "Kinder gehen dort oft spielen und lernen. Es ist kein Geschäft.",
  "location": "Innenstadt, Oelsnitz",
  "points": 120
}
```

---

## ✅ ЧЕКЛИСТ ГОТОВНОСТИ MVP

### День 1: Фундамент
- [ ] **Setup проекта**
  - [ ] Vite + Vue 3 + TypeScript инициализирован
  - [ ] Tailwind CSS настроен
  - [ ] Vue Router настроен
  - [ ] ESLint + Prettier (опционально)
  
- [ ] **Supabase настройка**
  - [ ] Проект создан
  - [ ] Таблицы созданы (quests, quest_attempts, photos)
  - [ ] Storage bucket создан
  - [ ] Environment variables настроены
  - [ ] Supabase client инициализирован
  
- [ ] **Базовый UI**
  - [ ] HomeView с кнопкой "Start"
  - [ ] QuestSetupView с 4 селекторами
  - [ ] Кнопки и основные компоненты
  - [ ] Немецкие тексты загружены

### День 2: AI & Функционал
- [ ] **Gemini интеграция**
  - [ ] API client настроен
  - [ ] Промпт для генерации квеста работает
  - [ ] Квест сохраняется в Supabase
  - [ ] Ошибки обрабатываются
  
- [ ] **Активный квест**
  - [ ] TaskCard отображает задание
  - [ ] PhotoCapture работает (камера)
  - [ ] Фото загружается в Supabase Storage
  - [ ] ProgressBar показывает прогресс
  
- [ ] **Проверка фото**
  - [ ] Gemini Vision анализирует фото
  - [ ] FeedbackModal показывает результат
  - [ ] Логика успех/неудача работает
  - [ ] Подсказки отображаются

### День 3: Награды & Deploy
- [ ] **Система наград**
  - [ ] CompletionScreen с статистикой
  - [ ] Бейджи отображаются
  - [ ] Логика присвоения бейджей работает
  - [ ] Сертификат генерируется (HTML → PDF)
  
- [ ] **Финализация**
  - [ ] Все тексты на немецком
  - [ ] Адаптивный дизайн (mobile-first)
  - [ ] Loader-анимации добавлены
  - [ ] Базовая обработка ошибок
  
- [ ] **Deployment**
  - [ ] `npm run build` проходит
  - [ ] Environment variables в Vercel
  - [ ] Deploy на Vercel выполнен
  - [ ] Тестирование на реальном устройстве
  - [ ] README.md обновлен

---

## 🔄 ФОРМАТ РАБОТЫ С CLAUDE

### Структура сессий
```
День 1 (Сессия 1):
- Claude создает проект
- Маленькими порциями генерирует код
- Вы тестируете каждый кусок
- Сохраняете прогресс в Claude Projects

День 2 (Сессия 2):
- Продолжение с сохраненным контекстом
- AI интеграция
- Итеративная разработка

День 3 (Сессия 3):
- Финальные компоненты
- Полировка
- Deploy
```

### Принцип итераций
```
1. Claude генерирует маленький компонент (20-50 строк)
2. Вы копируете код в VSCode
3. Тестируете локально
4. Сообщаете результат Claude
5. Claude исправляет или добавляет следующий кусок
6. Повторяете
```

### Пример запроса к Claude
```
"Создай компонент Button.vue с Tailwind CSS. 
Требования:
- Минималистичный дизайн
- Варианты: primary, secondary
- Размеры: large, medium
- TypeScript props
Создай только этот компонент, без других файлов."
```

---

## 🚫 ЧТО НЕ ВКЛЮЧЕНО В MVP

Следующие фичи **НЕ** реализуются в первой версии:

- ❌ Множественные города (только Oelsnitz)
- ❌ Социальные функции (друзья, лидерборды)
- ❌ Групповые квесты
- ❌ История пройденных квестов
- ❌ Профиль пользователя
- ❌ Платные функции
- ❌ Режим офлайн
- ❌ Геолокация в реальном времени
- ❌ Уведомления
- ❌ Мультиязычность (только немецкий)

---

## 💰 БЮДЖЕТ И ОГРАНИЧЕНИЯ

### API Costs (ожидаемые)
```
Gemini 1.5 Flash:
- Генерация квеста: ~$0.0001 / запрос
- Проверка фото: ~$0.0002 / фото
- Тестирование (50 запросов): ~$0.015

Supabase Free Tier:
- 500 MB database (достаточно)
- 1 GB file storage (достаточно для MVP)
- 50 MB bandwidth (ограничение)

Vercel Free Tier:
- 100 GB bandwidth (достаточно)
- Unlimited requests
```

### Технические ограничения MVP
- Максимум 10 одновременных квестов в день
- Размер фото: макс 2 MB
- Timeout AI: 30 секунд
- Кэширование квестов: 24 часа

---

## 📚 ДОПОЛНИТЕЛЬНЫЕ МАТЕРИАЛЫ

### Полезные ссылки для разработки
- Vue 3 Docs: https://vuejs.org/
- TypeScript: https://www.typescriptlang.org/
- Tailwind CSS: https://tailwindcss.com/
- Supabase Docs: https://supabase.com/docs
- Gemini API: https://ai.google.dev/
- Vercel Docs: https://vercel.com/docs

### Референсы похожих приложений
1. **DareMapp** - геймифицированные туры
2. **Questo** - story-driven квесты
3. **Locatify** - GPS-челленджи
4. **Wildgoose** - корпоративные квесты
5. **Lanna Passport** - AR + gamification

---

## 🎯 КРИТЕРИИ УСПЕХА MVP

Проект считается успешным, если:

✅ **Функционально**:
- Пользователь может создать квест с параметрами
- AI генерирует 5-7 заданий
- Можно сфотографировать и отправить фото
- AI проверяет фото и дает фидбек
- Экран завершения показывает награды
- Сертификат можно скачать

✅ **Технически**:
- Приложение работает на мобильных устройствах
- Все тексты на немецком
- Deployed на Vercel
- Код структурирован и читаем
- TypeScript без critical errors

✅ **Визуально**:
- Минималистичный UI
- Touch-friendly элементы
- Адаптивный дизайн
- Плавные переходы

---

## 🤝 СЛЕДУЮЩИЕ ШАГИ ПОСЛЕ MVP

### Версия 1.1 (будущее)
- Геолокация для подсказок
- Офлайн режим
- История квестов
- 2-3 дополнительных города

### Версия 2.0 (дальнейшее)
- Социальные функции
- Мультиязычность
- Монетизация (премиум квесты)
- Партнерство с туристическими офисами

---

## 📞 КОНТАКТЫ

**Разработчик**: [Ваше имя]  
**Email**: [Ваш email]  
**GitHub**: [Ваш GitHub]  
**Связь с INFORMA**: info@informa-medien.de

---

**ВЕРСИЯ ДОКУМЕНТА**: 1.0  
**ДАТА СОЗДАНИЯ**: 12 февраля 2026  
**СРОК РЕАЛИЗАЦИИ**: 3 дня  
**СТАТУС**: Ready to Implement

---

## 🚀 ГОТОВЫ НАЧАТЬ?

Это техническое задание содержит всю необходимую информацию для начала разработки в Claude Projects.

**Первый запрос к Claude**:
```
Привет! Я начинаю разработку PhotoQuest приложения по этому ТЗ.
День 1, Шаг 1: Помоги настроить проект Vite + Vue 3 + TypeScript.
Создай только базовую структуру, package.json и main.ts.
Делай маленькими шагами, чтобы я мог тестировать.
```

**Удачи! 🎉**
