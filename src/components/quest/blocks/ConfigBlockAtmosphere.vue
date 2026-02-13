<script setup lang="ts">
import { useQuestConfigStore } from '@/stores/questConfig'
import VintageSelect from '@/components/common/vintage/VintageSelect.vue'
import VintageCheckbox from '@/components/common/vintage/VintageCheckbox.vue'

const store = useQuestConfigStore()

const genreOptions = [
  { value: 'detective', label: 'Detective' },
  { value: 'history', label: 'Historical' },
  { value: 'adventure', label: 'Adventure' },
  { value: 'mystery', label: 'Mystery' },
  { value: 'crime', label: 'Crime' },
  { value: 'romance', label: 'Romance' },
  { value: 'fantasy', label: 'Fantasy' },
  { value: 'thriller', label: 'Thriller' },
  { value: 'comedy', label: 'Comedy' },
  { value: 'postapoc', label: 'Post-Apocalyptic' },
]

const atmosphereOptions = [
  'Mysterious',
  'Light & Fun',
  'Dark / Noir',
  'Romantic',
  'Intellectual',
  'Adrenaline',
  'Philosophical',
  'Ironic',
]
</script>

<template>
  <div class="space-y-8 animate-fade-in">
    <!-- Genre -->
    <VintageSelect v-model="store.config.genre" :options="genreOptions" label="6. Genre" />

    <!-- Atmosphere -->
    <div>
      <label class="block text-xs sm:text-sm font-bold uppercase tracking-wider text-secondary mb-4"
        >7. Atmosphere</label
      >
      <div class="grid grid-cols-2 gap-4">
        <VintageCheckbox
          v-for="atmo in atmosphereOptions"
          :key="atmo"
          v-model="store.config.atmosphere"
          :value="atmo"
          :label="atmo"
        />
      </div>
    </div>
  </div>
</template>
