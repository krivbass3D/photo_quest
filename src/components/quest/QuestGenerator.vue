<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useQuestStore } from '@/stores/quest'
import { useQuestConfigStore } from '@/stores/questConfig'
import { fetchPOIs } from '@/api/geo/overpass'
import QuestConfigurator from './QuestConfigurator.vue'

const router = useRouter()
const questStore = useQuestStore()
const configStore = useQuestConfigStore()

const handleGenerate = async () => {
  const { city, lat, lon, ...restConfig } = configStore.config

  // Validation
  if (!city || !lat || !lon) {
    alert('Please select a valid city from the list.')
    return
  }

  // 1. Fetch real POIs based on city
  const pois = await fetchPOIs(lat, lon)

  if (pois.length === 0) {
    alert('No interesting locations found in this area. Please try another city or center.')
    return
  }

  // 2. Call Store action to trigger AI generation
  // Mapping configStore params to what createQuest expects
  await questStore.createQuest({
    city,
    ...restConfig, // Passes language, atmosphere, etc.
    pois,
  })

  // 3. Navigate to active quest if successful
  if (questStore.currentQuest) {
    router.push('/quest')
  }
}
</script>

<template>
  <div class="w-full">
    <QuestConfigurator @generate="handleGenerate" />

    <!-- Global Error Overlay if needed -->
    <div
      v-if="questStore.error"
      class="fixed bottom-4 right-4 bg-error text-white p-4 rounded shadow-lg z-50"
    >
      {{ questStore.error }}
    </div>

    <!-- Global Loader Overlay -->
    <div
      v-if="questStore.isLoading"
      class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
    >
      <div class="bg-white p-8 rounded-lg flex flex-col items-center">
        <div class="animate-spin text-4xl mb-4">🧭</div>
        <div class="font-serif text-xl">Generating your adventure...</div>
      </div>
    </div>
  </div>
</template>
