<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuestStore } from '@/stores/quest'
import { fetchPOIs } from '@/api/geo/overpass'

const router = useRouter()
const questStore = useQuestStore()

const form = ref({
  city: 'Deutschland',
  duration: 60,
  transport: 'walking',
  difficulty: 'medium',
  genre: 'history',
})

const generateQuest = async () => {
  // 1. Fetch real POIs based on city (MVP uses fixed coordinates for Oelsnitz/Deutschland demo)
  // Oelsnitz (Vogtl) coordinates: 50.415, 12.169
  const lat = 50.415
  const lon = 12.169

  const pois = await fetchPOIs(lat, lon)

  if (pois.length === 0) {
    alert('Keine Orte gefunden. Bitte versuche es später erneut.')
    return
  }

  // 2. Call Store action to trigger AI generation
  await questStore.createQuest({
    ...form.value,
    pois,
  })

  // 3. Navigate to active quest if successful
  if (questStore.currentQuest) {
    router.push('/quest')
  }
}
</script>

<template>
  <div
    class="w-full max-w-md lg:max-w-lg bg-white p-6 sm:p-8 shadow-xl border-4 border-double border-secondary/30 relative mx-auto my-4 sm:my-0"
  >
    <!-- Paper texture overlay -->
    <div class="absolute inset-0 bg-yellow-50/50 mix-blend-multiply pointer-events-none"></div>

    <div class="relative z-10">
      <h2
        class="vintage-header text-2xl sm:text-3xl text-text text-center mb-6 sm:mb-8 border-b-2 border-text/10 pb-4"
      >
        {{ $t('setup.title') }}
      </h2>

      <div class="space-y-6 sm:space-y-8">
        <!-- Duration -->
        <div>
          <label
            class="block text-xs sm:text-sm font-bold uppercase tracking-wider text-secondary mb-2 sm:mb-3"
            >{{ $t('setup.duration') }}</label
          >
          <div class="relative pt-1">
            <input
              v-model.number="form.duration"
              type="range"
              min="30"
              max="180"
              step="30"
              class="w-full h-3 bg-gray-200 rounded-full appearance-none cursor-pointer accent-primary border border-gray-300 touch-pan-y"
            />
            <div
              class="flex justify-between text-[0.65rem] sm:text-xs font-bold text-gray-400 mt-2 font-mono"
            >
              <span>30'</span>
              <span>60'</span>
              <span>90'</span>
              <span>120'</span>
              <span>180'</span>
            </div>
            <div class="text-center mt-2 font-serif text-xl sm:text-2xl text-primary font-bold">
              {{ form.duration }}
              <span class="text-sm sm:text-base text-gray-500 font-sans">Min</span>
            </div>
          </div>
        </div>

        <!-- Difficulty -->
        <div>
          <label
            class="block text-xs sm:text-sm font-bold uppercase tracking-wider text-secondary mb-2 sm:mb-3"
            >{{ $t('setup.difficulty') }}</label
          >
          <div class="flex border-2 border-text rounded-none overflow-hidden bg-surface">
            <button
              v-for="opt in ['easy', 'medium', 'hard']"
              :key="opt"
              :class="[
                'flex-1 py-2 sm:py-3 text-xs sm:text-sm font-bold uppercase tracking-wide transition-colors border-r-2 border-text last:border-r-0',
                form.difficulty === opt
                  ? 'bg-primary text-background'
                  : 'hover:bg-text/5 text-text/60',
              ]"
              @click="form.difficulty = opt"
            >
              {{ $t(`setup.difficulty_${opt}`) }}
            </button>
          </div>
        </div>

        <!-- Genre -->
        <div>
          <label
            class="block text-xs sm:text-sm font-bold uppercase tracking-wider text-secondary mb-2 sm:mb-3"
            >{{ $t('setup.genre') }}</label
          >
          <div class="relative">
            <select
              v-model="form.genre"
              class="w-full bg-surface border-2 border-text text-text font-serif text-base sm:text-lg p-2 sm:p-3 outline-none appearance-none rounded-none focus:border-primary transition-colors cursor-pointer"
            >
              <option value="history">{{ $t('setup.genre_history') }}</option>
              <option value="mystery">{{ $t('setup.genre_mystery') }}</option>
              <option value="kids">{{ $t('setup.genre_kids') }}</option>
            </select>
            <div
              class="absolute right-4 top-1/2 transform -translate-y-1/2 text-text pointer-events-none text-xs sm:text-base"
            >
              ▼
            </div>
          </div>
        </div>

        <!-- Submit -->
        <button
          :disabled="questStore.isLoading"
          class="w-full mt-4 group relative focus:outline-none disabled:opacity-70 touch-manipulation"
          @click="generateQuest"
        >
          <span
            class="relative z-10 flex items-center justify-center bg-text text-background font-bold uppercase tracking-[0.15em] py-3 sm:py-4 text-sm sm:text-base border-2 border-primary transform group-hover:-translate-y-1 group-active:translate-y-0 transition-transform duration-200"
          >
            <span v-if="questStore.isLoading" class="animate-pulse">{{
              $t('setup.create_loader')
            }}</span>
            <span v-else>{{ $t('setup.createButton') }}</span>
          </span>
          <span
            class="absolute top-0 left-0 w-full h-full bg-primary transform translate-y-1 translate-x-1"
          ></span>
        </button>

        <p
          v-if="questStore.error"
          class="text-error font-bold text-xs sm:text-sm text-center mt-4 border border-error/20 bg-error/5 p-2"
        >
          {{ questStore.error }}
        </p>
      </div>
    </div>
  </div>
</template>
