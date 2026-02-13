<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useQuestStore } from '@/stores/quest'
import JournalStep from '@/components/quest/JournalStep.vue'
import VerticalRoute from '@/components/quest/VerticalRoute.vue'

const router = useRouter()
const store = useQuestStore()
const quest = computed(() => store.currentQuest)

const currentIndex = computed(() => store.currentTaskIndex)

// Determine the active task to show
const activeTask = computed(() => {
  if (!quest.value?.tasks) return null
  return quest.value.tasks[currentIndex.value]
})

const isQuestComplete = computed(() => {
  if (!quest.value?.tasks) return false
  return quest.value.tasks.every((t) => t.isCompleted)
})

const finishQuest = () => {
  router.push('/rewards')
}

// Navigation for MVP validation (in real app, this happens automatically on success)
const nextStep = () => {
  store.nextTask()
}
</script>

<template>
  <div class="min-h-screen bg-paper text-ink font-sans pb-20">
    <!-- Header -->
    <header class="py-12 text-center relative border-b-2 border-ink/10">
      <div class="absolute top-4 left-4 border-2 border-ink/30 p-2 rotate-[-5deg] opacity-70">
        <span class="font-display font-bold text-xs tracking-widest uppercase text-ink/50 block"
          >CLASSIFIED</span
        >
        <span class="font-display font-bold text-xl tracking-widest uppercase text-stamp-red block"
          >REISEAKTE</span
        >
      </div>

      <h1
        class="font-display text-4xl sm:text-5xl md:text-6xl text-ink mb-2 uppercase tracking-wide"
      >
        Die Verlorene Expedition
      </h1>
      <p class="font-serif text-lg md:text-xl text-ink/60 italic">
        Eine fotografische Mission in {{ quest?.city || 'Unbekannt' }}
      </p>
    </header>

    <main
      v-if="quest"
      class="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 md:grid-cols-[80px_1fr] gap-8"
    >
      <!-- Left Sidebar: Route (Hidden on mobile for simplification or added as horizontal top bar) -->
      <aside class="hidden md:block sticky top-8 h-[calc(100vh-100px)]">
        <VerticalRoute :total-steps="quest.tasks.length" :current-step-index="currentIndex" />
      </aside>

      <!-- Main Content Area -->
      <div class="space-y-12">
        <!-- Active Step -->
        <div v-if="activeTask && !isQuestComplete" class="min-h-[600px] flex flex-col">
          <JournalStep :task="activeTask" :index="currentIndex" :is-active="true" />

          <!-- Navigation Override for MVP manual progression if needed, or just status -->
          <div v-if="activeTask.isCompleted" class="mt-8 text-center">
            <button
              class="bg-ink text-paper font-display font-bold uppercase tracking-widest px-8 py-4 text-xl hover:bg-stamp-red transition-colors shadow-lg"
              @click="isQuestComplete ? finishQuest() : nextStep()"
            >
              {{ isQuestComplete ? 'Mission Abschließen' : 'Nächster Halt →' }}
            </button>
          </div>
        </div>

        <!-- Completion State -->
        <div v-if="isQuestComplete" class="text-center py-20 animate-fade-in">
          <div class="inline-block p-12 bg-white shadow-2xl skew-y-1 border border-ink/20 relative">
            <div
              class="absolute -top-6 -right-6 w-24 h-24 bg-stamp-red rounded-full flex items-center justify-center text-paper font-display font-bold text-xl rotate-12 shadow-lg animate-bounce"
            >
              100%
            </div>

            <h2 class="font-display text-4xl text-ink mb-4 uppercase">Missionsbericht</h2>
            <p class="font-journal text-2xl text-ink/70 mb-8 italic">Das Archiv ist vollständig.</p>

            <button
              class="bg-gold text-ink font-display font-bold uppercase tracking-widest px-10 py-5 text-xl border-2 border-ink hover:-translate-y-1 transition-transform shadow-[4px_4px_0px_rgba(31,42,68,1)]"
              @click="finishQuest"
            >
              Ergebnisse Ansehen
            </button>
          </div>
        </div>
      </div>
    </main>

    <div v-else class="min-h-screen flex flex-col items-center justify-center">
      <div class="animate-spin text-4xl mb-4">🧭</div>
      <p class="font-serif text-xl text-ink/50">Lade Akten...</p>
      <router-link to="/setup" class="text-stamp-red underline mt-4 font-bold"
        >Zurück zum Start</router-link
      >
    </div>
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 1s ease-out forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
