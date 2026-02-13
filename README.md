# 📸 PhotoQuest: The Lost Expedition

A unique AI-powered city exploration game that turns a standard photo quest into a **1930s Vintage Expedition**.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Vue](https://img.shields.io/badge/Vue.js-3.x-green.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)
![Supabase](https://img.shields.io/badge/Supabase-Edge_Functions-green.svg)

## 🌍 Philosophy

PhotoQuest is not just another checklist app. It reimagines urban exploration as a documentary mission.

- **No Props Required**: The city itself is the playground.
- **AI-Driven Configurator**: Users generate unique quests for _any_ city in the world.
- **Vintage Aesthetic**: Inspired by 1930s travel posters and expedition journals.
- **Focus on Observation**: Tasks reward finding details, angles, and hidden gems, not just GPS check-ins.

## ✨ Key Features

### 1. Retro-Styled Configurator

A split-screen wizard that guides users through creating their own adventure.

- **Vintage UI Kit**: Custom "paper" inputs, "stamp" checkboxes, and retro sliders.
- **Live Preview**: See the quest description evolve as you change parameters.
- **Smart City Search**: Integrated with OpenStreetMap (Nominatim) for global coverage.

### 2. AI Quest Generation

Powered by OpenAI (via Supabase Edge Functions), the system generates:

- A cohesive narrative theme (e.g., "The Shadow of the Architect").
- 5-8 unique photo tasks based on real POIs (using Overpass API).
- Context-aware hints and "Golden Hour" photography tips.

### 3. The Expedition Journal (Active Gameplay)

The gameplay interface is designed as a physical explorer's journal.

- **Vertical Timeline**: Track your progress through the city.
- **Tilted Photo Frames**: Upload evidence that looks like developed photos.
- **Ink Stamp Feedback**: AI verifies photos (mocked for MVP) and stamps "APPROVED" or "REJECTED" directly on the page.
- **Hidden Envelopes**: Hints are concealed in interactive envelopes to discourage overuse.

## 🛠 Tech Stack

- **Frontend**: Vue 3, Pinia, Vue Router, Tailwind CSS
- **Backend**: Supabase (Edge Functions, Database)
- **Maps/Data**: OpenStreetMap (Nominatim for search, Overpass API for POIs)
- **AI**: OpenAI GPT-4o-mini (via Edge Functions)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Supabase CLI (optional, for local backend dev)

### Installation

1.  **Clone the repository**

    ```bash
    git clone https://github.com/your-username/photo-quest.git
    cd photo-quest
    ```

2.  **Install dependencies**

    ```bash
    npm install
    ```

3.  **Environment Setup**
    Create a `.env.local` file:

    ```env
    VITE_SUPABASE_URL=your_supabase_url
    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

4.  **Run Development Server**
    ```bash
    npm run dev
    ```

## 🗺 Roadmap

- [x] **Phase 1: Configurator** (Vintage UI, City Search, AI Integration)
- [x] **Phase 2: Expedition Journal** (Active Quest UI, Stamps, Timeline)
- [ ] **Phase 3: Real AI Vision** (Validate photos with GPT-4o-Vision)
- [ ] **Phase 4: Social Sharing** (Share your "Mission Report" as a postcard)

## 📄 License

MIT License. See [LICENSE](LICENSE) for details.
