<script setup lang="ts">
import { ref, computed } from 'vue'
import { useQuestConfigStore } from '@/stores/questConfig'
import ConfigBlockBasic from './blocks/ConfigBlockBasic.vue'
import ConfigBlockAtmosphere from './blocks/ConfigBlockAtmosphere.vue'
import ConfigBlockMechanics from './blocks/ConfigBlockMechanics.vue'
import ConfigBlockLanguage from './blocks/ConfigBlockLanguage.vue'

const emit = defineEmits<{
  (e: 'generate'): void
}>()

const store = useQuestConfigStore()
const currentStep = ref(1)
const totalSteps = 4

const nextStep = () => {
  if (currentStep.value < totalSteps) currentStep.value++
}

const prevStep = () => {
  if (currentStep.value > 1) currentStep.value--
}

const progress = computed(() => (currentStep.value / totalSteps) * 100)

// Emoji mapping for preview
const genreEmojis: Record<string, string> = {
  detective: '🕵️‍♀️',
  history: '🏛️',
  adventure: '🤠',
  mystery: '🔮',
  crime: '🔦',
  romance: '🌹',
  fantasy: '🐉',
  thriller: '🔪',
  comedy: '🎭',
  postapoc: '☢️',
}
</script>

<template>
  <div class="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto p-4">
    <!-- LEFT PANEL: Config Form -->
    <div
      class="w-full lg:w-1/2 bg-white p-6 sm:p-8 shadow-xl border-4 border-double border-secondary/30 relative"
    >
      <div class="absolute inset-0 bg-yellow-50/50 mix-blend-multiply pointer-events-none"></div>

      <div class="relative z-10">
        <!-- Header & Progress -->
        <div class="mb-6">
          <div class="flex justify-between items-end mb-2 text-primary font-bold font-serif">
            <h2 class="text-2xl">Quest Configuration</h2>
            <span class="text-xl">{{ currentStep }}/{{ totalSteps }}</span>
          </div>
          <div class="w-full h-2 bg-text/10 overflow-hidden">
            <div
              class="h-full bg-primary transition-all duration-500 ease-out"
              :style="{ width: `${progress}%` }"
            ></div>
          </div>
        </div>

        <!-- Dynamic Block Content -->
        <div class="min-h-[400px]">
          <ConfigBlockBasic v-if="currentStep === 1" />
          <ConfigBlockAtmosphere v-else-if="currentStep === 2" />
          <ConfigBlockMechanics v-else-if="currentStep === 3" />
          <ConfigBlockLanguage v-else-if="currentStep === 4" />
        </div>

        <!-- Navigation Buttons -->
        <div class="flex justify-between mt-8 pt-6 border-t border-text/10">
          <button v-if="currentStep > 1" class="vintage-btn-secondary" @click="prevStep">
            ← Back
          </button>
          <div v-else></div>
          <!-- Spacer -->

          <button v-if="currentStep < totalSteps" class="vintage-btn-primary" @click="nextStep">
            Next Step →
          </button>
          <button
            v-else
            class="vintage-btn-primary bg-success border-success text-white"
            @click="$emit('generate')"
          >
            ✨ Generate Quest
          </button>
        </div>
      </div>
    </div>

    <!-- RIGHT PANEL: Live Preview -->
    <div
      class="w-full lg:w-1/2 relative bg-text text-background p-8 shadow-2xl flex flex-col justify-center items-center text-center overflow-hidden min-h-[500px]"
    >
      <!-- Animated Background Texture -->
      <div
        class="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')]"
      ></div>

      <!-- Vintage Border -->
      <div class="absolute inset-4 border-2 border-background/20 m-2"></div>

      <div class="relative z-10 space-y-6 max-w-sm mx-auto animate-float">
        <!-- Genre Emoji / Image Placeholder -->
        <div
          class="text-9xl mb-4 drop-shadow-2xl grayscale hover:grayscale-0 transition-all duration-700"
        >
          {{ genreEmojis[store.config.genre] || '🌍' }}
        </div>

        <h1
          class="font-serif text-4xl sm:text-5xl font-bold text-accent tracking-wider leading-tight"
        >
          {{ store.config.city || 'ANY CITY' }}
        </h1>

        <div class="w-24 h-1 bg-accent mx-auto my-4"></div>

        <p class="font-serif text-xl sm:text-2xl text-background/90 italic">
          "{{ store.previewText }}"
        </p>

        <div
          class="grid grid-cols-2 gap-4 mt-8 text-xs font-bold tracking-widest uppercase opacity-70"
        >
          <div class="border border-background/30 p-2">{{ store.config.duration }} Minutes</div>
          <div class="border border-background/30 p-2">
            {{ store.config.difficulty }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.vintage-btn-primary {
  @apply px-8 py-3 bg-primary text-background font-bold uppercase tracking-widest text-sm border-2 border-primary hover:bg-background hover:text-primary transition-all shadow-md active:translate-y-1;
}

.vintage-btn-secondary {
  @apply px-8 py-3 bg-transparent text-text font-bold uppercase tracking-widest text-sm border-2 border-text/50 hover:border-text transition-all;
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0px);
  }
}

/* Custom fade transition for blocks */
.v-enter-active,
.v-leave-active {
  transition: opacity 0.3s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
