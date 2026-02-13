<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useQuestStore } from '@/stores/quest'
import TaskCard from '@/components/quest/TaskCard.vue'

const router = useRouter()
const store = useQuestStore()
const quest = computed(() => store.currentQuest)

const progress = computed(() => {
  if (!quest.value?.tasks) return 0
  const completed = quest.value.tasks.filter((t) => t.isCompleted).length
  return Math.round((completed / quest.value.tasks.length) * 100)
})

const isQuestComplete = computed(() => progress.value === 100)

const finishQuest = () => {
  router.push('/rewards')
}
</script>

<template>
  <div class="min-h-screen pb-20 px-4 sm:px-6 lg:px-8 overflow-y-auto">
    <!-- Header -->
    <header class="max-w-3xl mx-auto pt-8 pb-6 text-center">
      <div class="inline-block border-b-4 border-primary pb-2 mb-4">
        <h1 class="vintage-header text-3xl sm:text-4xl text-text">
          {{ $t('quest.title') }}
        </h1>
      </div>
      <p class="text-secondary font-medium">{{ $t('quest.subtitle') }}</p>
    </header>

    <!-- Content -->
    <main v-if="quest" class="max-w-3xl mx-auto space-y-8">
      <!-- Progress Bar (Vintage Style) -->
      <div class="bg-surface border-2 border-text p-1 shadow-sm">
        <div class="h-4 bg-gray-200 relative">
          <div
            class="h-full bg-primary transition-all duration-1000 ease-out relative"
            :style="{ width: `${progress}%` }"
          >
            <!-- Indicator triangle -->
            <div
              class="absolute right-0 -top-1 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-text translate-x-1/2"
            ></div>
          </div>
        </div>
        <div
          class="flex justify-between text-xs font-bold uppercase tracking-widest mt-1 text-text/60"
        >
          <span>START</span>
          <span>{{ progress }}%</span>
          <span>ZIEL</span>
        </div>
      </div>

      <!-- Task List -->
      <div class="grid gap-6">
        <TaskCard v-for="(task, index) in quest.tasks" :key="task.id" :task="task" :index="index" />
      </div>

      <!-- Completion Actions -->
      <div v-if="isQuestComplete" class="text-center py-8 animate-fade-in-up">
        <div class="vintage-border bg-white p-8 inline-block shadow-xl transform rotate-1">
          <h3 class="vintage-header text-2xl text-success mb-2">{{ $t('quest.finish_title') }}</h3>
          <p class="text-text mb-6">{{ $t('quest.finish_desc') }}</p>
          <button
            class="bg-primary text-white text-lg font-bold uppercase tracking-widest px-8 py-4 border-2 border-text hover:-translate-y-1 transition-transform"
            @click="finishQuest"
          >
            {{ $t('quest.claim_rewards') }}
          </button>
        </div>
      </div>
    </main>

    <div v-else class="text-center py-20">
      <p class="text-xl text-text/50">Lade Quest...</p>
      <router-link to="/setup" class="text-primary underline mt-4 block"
        >Zurück zum Start</router-link
      >
    </div>
  </div>
</template>

<style scoped>
.animate-fade-in-up {
  animation: fadeInUp 0.5s ease-out forwards;
}

@keyframes fadeInUp {
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
