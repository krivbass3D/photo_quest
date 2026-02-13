<script setup lang="ts">
import { useQuestConfigStore } from '@/stores/questConfig'
import VintageAutocomplete from '@/components/common/vintage/VintageAutocomplete.vue'
import VintageSlider from '@/components/common/vintage/VintageSlider.vue'
import VintageToggle from '@/components/common/vintage/VintageToggle.vue'
import VintageSelect from '@/components/common/vintage/VintageSelect.vue'

const store = useQuestConfigStore()

const handleCitySelect = (location: { lat: number; lon: number; name: string }) => {
  store.setCity(location.name)
  store.setCoordinates(location.lat, location.lon)
}

const difficultyOptions = [
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' },
  { value: 'expert', label: 'Expert' },
]

const playerOptions = [
  { value: 'solo', label: 'Solo Player' },
  { value: 'couple', label: 'Couple' },
  { value: 'small_group', label: 'Small Group (3-5)' },
  { value: 'family', label: 'Family with Kids' },
  { value: 'corporate', label: 'Corporate Team' },
  { value: 'teens', label: 'Teens' },
]

const audienceOptions = [
  { value: 'tourist', label: 'Tourists' },
  { value: 'local', label: 'Locals' },
  { value: 'couple', label: 'Romantic Couple' },
  { value: 'family', label: 'Family' },
  { value: 'friends', label: 'Friends' },
  { value: 'colleagues', label: 'Colleagues' },
  { value: 'teens', label: 'Teenagers (12-16)' },
  { value: 'universal', label: 'Universal' },
]
</script>

<template>
  <div class="space-y-8 animate-fade-in">
    <!-- City -->
    <VintageAutocomplete
      v-model="store.config.city"
      label="1. City"
      placeholder="Type a city name..."
      @select="handleCitySelect"
    />

    <!-- Duration -->
    <VintageSlider
      v-model="store.config.duration"
      :min="30"
      :max="180"
      :step="30"
      label="2. Duration (Minutes)"
      :format-value="(v) => `${v} min`"
    />

    <!-- Difficulty -->
    <VintageToggle
      v-model="store.config.difficulty"
      :options="difficultyOptions"
      label="3. Difficulty"
    />

    <!-- Players & Audience -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <VintageSelect
        v-model="store.config.playersFormat"
        :options="playerOptions"
        label="4. Player Format"
      />

      <VintageSelect
        v-model="store.config.audience"
        :options="audienceOptions"
        label="5. Target Audience"
      />
    </div>
  </div>
</template>
