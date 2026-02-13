<script setup lang="ts">
import { useQuestConfigStore } from '@/stores/questConfig'
import VintageSelect from '@/components/common/vintage/VintageSelect.vue'

const store = useQuestConfigStore()

const languageOptions = [
  { value: 'ru', label: 'Русский' },
  { value: 'en', label: 'English' },
  { value: 'de', label: 'Deutsch' },
  { value: 'uk', label: 'Українська' },
]

const presetOptions = [
  { value: 'romance', label: '❤️ Romantic Date' },
  { value: 'mystery', label: '🕵️ Old Town Mystery' },
  { value: 'family', label: '👨‍👩‍👧 Family Adventure' },
  { value: 'legend', label: '👻 City Legend' },
  { value: 'detective', label: '🔍 Detective Story' },
  { value: 'light', label: '📸 Light Tourist Quest' },
]

const applyPreset = (preset: string) => {
  store.applyTemplate(preset)
}
</script>

<template>
  <div class="space-y-8 animate-fade-in">
    <!-- Language -->
    <VintageSelect
      v-model="store.config.language"
      :options="languageOptions"
      label="10. Generation Language"
    />

    <!-- Presets -->
    <div>
      <label class="block text-xs sm:text-sm font-bold uppercase tracking-wider text-secondary mb-4"
        >11. Quick Presets</label
      >
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          v-for="preset in presetOptions"
          :key="preset.value"
          class="preset-card"
          @click="applyPreset(preset.value)"
        >
          {{ preset.label }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.preset-card {
  @apply p-4 border-2 border-text/20 bg-surface/50 text-left font-serif text-lg transition-all hover:bg-surface hover:border-primary hover:-translate-y-1 hover:shadow-lg;
}
</style>
