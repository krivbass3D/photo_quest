<script setup lang="ts">
import { useQuestConfigStore } from '@/stores/questConfig'
import VintageToggle from '@/components/common/vintage/VintageToggle.vue'
import VintageCheckbox from '@/components/common/vintage/VintageCheckbox.vue'

const store = useQuestConfigStore()

const taskTypeOptions = [
  'Logic Puzzles',
  'Ciphers',
  'Rebus',
  'Find Details',
  'Observation',
  'Photo Challenges',
  'Choice & Consequence',
  'Mini-Dialogues',
]

const linearityOptions = [
  { value: 'linear', label: 'Linear (Step-by-Step)' },
  { value: 'branching', label: 'Branching' },
  { value: 'open', label: 'Open Structure' },
]
</script>

<template>
  <div class="space-y-8 animate-fade-in">
    <!-- Task Types -->
    <div>
      <label class="block text-xs sm:text-sm font-bold uppercase tracking-wider text-secondary mb-4"
        >8. Task Types</label
      >
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <VintageCheckbox
          v-for="type in taskTypeOptions"
          :key="type"
          v-model="store.config.taskTypes"
          :value="type"
          :label="type"
        />
      </div>
    </div>

    <!-- Linearity -->
    <VintageToggle
      v-model="store.config.linearity"
      :options="linearityOptions"
      label="9. Structure"
    />
  </div>
</template>
