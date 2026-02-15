<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuestStore } from '@/stores/quest'
import JournalStep from '@/components/quest/JournalStep.vue'

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

const goToTask = (index: number) => {
  store.setTaskIndex(index)
}

const showIntro = ref(true)
const closeIntro = () => {
  showIntro.value = false
}
</script>

<template>
  <div class="min-h-screen bg-paper text-ink font-sans pb-20 w-full overflow-x-hidden">
    <!-- Header -->
    <header class="sticky top-0 z-40 bg-paper/95 backdrop-blur-sm shadow-md transition-all pt-4 pb-4 px-2 sm:px-4 border-b-2 border-ink/10 w-full">
      <div class="max-w-3xl mx-auto text-center relative w-full px-2">
        <!-- Stamp -->
        <div class="absolute top-0 left-0 sm:left-[-20px] scale-50 sm:scale-75 origin-top-left border-2 border-ink/30 p-1 rotate-[-5deg] opacity-50 hidden xs:block sm:block">
          <span class="font-display font-bold text-[0.6rem] tracking-widest uppercase text-ink/50 block">CLASSIFIED</span>
          <span class="font-display font-bold text-sm tracking-widest uppercase text-stamp-red block">REISEAKTE</span>
        </div>

        <h1 class="font-display text-xl sm:text-3xl md:text-4xl text-ink mb-1 uppercase tracking-wide leading-tight px-2 sm:px-8 break-words">
          {{ quest?.theme || 'Die Verlorene Expedition' }}
        </h1>
        <p class="font-serif text-xs sm:text-sm text-ink/60 italic mb-4">
          {{ quest?.city || 'Unbekannt' }}
        </p>

        <!-- Horizontal Progress Steps (Clickable) -->
        <div v-if="quest" class="flex items-center justify-center gap-2 sm:gap-4 overflow-x-auto pb-2 scrollbar-hide">
          <div 
             v-for="(task, i) in quest.tasks" 
             :key="task.id"
             class="relative flex flex-col items-center group cursor-pointer"
             @click="goToTask(i)"
          >
             <!-- Connector Line -->
             <div 
               v-if="i < quest.tasks.length" 
               class="absolute top-1/2 left-1/2 w-full h-0.5 -z-10"
               :class="i < currentIndex || task.isCompleted ? 'bg-ink' : 'bg-ink/10'"
               style="transform: translateY(-50%) translateX(50%); width: calc(100% + 0.5rem);"
             ></div>

             <!-- Circle -->
             <div
                class="w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 bg-paper relative z-10 hover:shadow-md"
                :class="[
                  task.isCompleted ? 'bg-ink/5 border-ink' : i === currentIndex ? 'border-stamp-red' : 'border-ink/20',
                  i === currentIndex ? 'scale-110 shadow-lg' : 'hover:scale-105'
                ]"
             >
                <span v-if="task.isCompleted" class="text-[0.6rem] sm:text-xs">✅</span>
                <span v-else class="text-[0.6rem] sm:text-xs font-display" :class="i === currentIndex ? 'text-stamp-red font-bold' : 'text-ink/40'">{{ i + 1 }}</span>
             </div>
          </div>

          <!-- Final Result Circle (🏁) -->
          <div 
            class="relative flex flex-col items-center group cursor-pointer ml-2"
            @click="goToTask(quest.tasks.length)"
          >
             <div
                class="w-6 h-6 sm:w-8 sm:h-8 rounded-full border-4 border-double flex items-center justify-center transition-all duration-300 bg-paper relative z-10"
                :class="currentIndex === quest.tasks.length ? 'border-stamp-red scale-110 shadow-lg' : isQuestComplete ? 'border-gold bg-gold/10' : 'border-ink/10'"
             >
                <span class="text-[0.6rem] sm:text-xs">🏁</span>
             </div>
          </div>
        </div>
      </div>
    </header>

    <main v-if="quest" class="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <div class="space-y-8 pb-20">
        <!-- Intro Modal -->
        <div v-if="showIntro && quest.intro" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div class="bg-paper p-6 sm:p-8 max-w-[95vw] sm:max-w-lg w-full shadow-2xl skew-y-1 relative border-2 border-gold/20 max-h-[85vh] flex flex-col">
             <h2 class="font-display text-xl sm:text-3xl mb-4 text-ink uppercase flex-shrink-0">Dein Auftrag</h2>
             <div class="overflow-y-auto pr-2 mb-8 custom-scrollbar">
                <p class="font-journal text-lg sm:text-xl text-ink/80 italic leading-relaxed">"{{ quest.intro }}"</p>
             </div>
             <button class="w-full bg-ink text-paper font-display font-bold uppercase py-4 hover:bg-stamp-red transition-colors flex-shrink-0" @click="closeIntro">
               Akzeptieren & Beginnen
             </button>
          </div>
        </div>

        <!-- Active Task View -->
        <div v-if="activeTask && currentIndex < quest.tasks.length" class="min-h-[400px] sm:min-h-[500px] flex flex-col relative z-0">
          <JournalStep :task="activeTask" class="scale-up" :index="currentIndex" :is-active="true" />

          <!-- Navigation Footer -->
          <div class="mt-8 flex justify-center">
            <button
              v-if="activeTask.isCompleted"
              class="bg-ink text-paper font-display font-bold uppercase tracking-widest px-8 py-4 text-lg sm:text-xl hover:bg-stamp-red transition-colors shadow-lg"
              @click="currentIndex === quest.tasks.length - 1 ? goToTask(quest.tasks.length) : store.nextTask()"
            >
              {{ currentIndex === quest.tasks.length - 1 ? 'Zum Abschluss 🏁' : 'Nächster Halt →' }}
            </button>
          </div>
        </div>

        <!-- Final Report (Dossier Preview) -->
        <div v-if="isQuestComplete" class="text-center py-12 animate-fade-in">
          <div class="inline-block p-12 bg-white shadow-2xl skew-y-1 border border-ink/20 relative overflow-hidden">
            <div class="absolute top-0 left-0 w-full h-2 bg-gold"></div>
            <div class="absolute -top-6 -right-6 w-24 h-24 bg-stamp-red rounded-full flex items-center justify-center text-paper font-display font-bold text-xl rotate-12 shadow-lg animate-bounce">
              100%
            </div>

            <h2 class="font-display text-4xl text-ink mb-2 uppercase">Missions-Dossier</h2>
            <p class="font-serif text-lg text-ink/60 italic mb-8">Bericht abgeschlossen</p>
            
            <div class="text-left bg-paper/50 p-6 border-l-4 border-gold mb-8 italic font-journal text-xl">
               <p>"Die Fragmente des Rätsels sind zusammengefügt. Du hast die Geheimnisse von {{ quest.city }} erfolgreich dokumentiert."</p>
            </div>

            <button
              class="bg-gold text-ink font-display font-bold uppercase tracking-widest px-10 py-5 text-xl border-2 border-ink hover:-translate-y-1 transition-transform shadow-[4px_4px_0px_rgba(31,42,68,1)]"
              @click="finishQuest"
            >
              Dossier ansehen
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

.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(31, 42, 68, 0.05);
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(31, 42, 68, 0.2);
  border-radius: 2px;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
