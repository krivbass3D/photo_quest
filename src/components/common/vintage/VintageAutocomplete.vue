<script setup lang="ts">
import { ref } from 'vue'
import { searchCity, type NominatimResult } from '@/api/geo/nominatim'
import VintageInput from './VintageInput.vue'

// Custom debounce
const debounce = (fn: Function, ms: number) => {
  let timeoutId: ReturnType<typeof setTimeout>
  return function (...args: any[]) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn.apply(null, args), ms)
  }
}

const props = defineProps<{
  modelValue: string
  label?: string
  placeholder?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'select', location: { lat: number; lon: number; name: string }): void
}>()

const searchQuery = ref(props.modelValue)
const results = ref<NominatimResult[]>([])
const showResults = ref(false)
const isLoading = ref(false)

const handleInput = debounce(async (val: string) => {
  searchQuery.value = val
  emit('update:modelValue', val)

  if (val.length < 3) {
    results.value = []
    showResults.value = false
    return
  }

  isLoading.value = true
  try {
    results.value = await searchCity(val)
    showResults.value = results.value.length > 0
  } finally {
    isLoading.value = false
  }
}, 500)

const selectCity = (city: NominatimResult) => {
  // Extract a shorter name if possible, or use display_name
  const name = city.display_name.split(',')[0]
  searchQuery.value = name
  emit('update:modelValue', name)
  emit('select', {
    lat: parseFloat(city.lat),
    lon: parseFloat(city.lon),
    name: name,
  })
  showResults.value = false
}

// Close dropdown when clicking outside (simple implementation)
// Ideally use v-click-outside
</script>

<template>
  <div class="relative z-50">
    <VintageInput
      :model-value="searchQuery"
      :label="label"
      :placeholder="placeholder"
      @update:model-value="handleInput"
    />

    <div v-if="isLoading" class="absolute right-2 top-9 text-text/40 text-xs animate-pulse">
      Searching...
    </div>

    <div
      v-if="showResults"
      class="absolute w-full mt-1 bg-background border-2 border-text shadow-xl max-h-60 overflow-y-auto z-50"
    >
      <ul>
        <li
          v-for="city in results"
          :key="city.place_id"
          class="p-3 border-b border-text/10 hover:bg-surface cursor-pointer font-serif text-sm transition-colors"
          @click="selectCity(city)"
        >
          <div class="font-bold text-primary">{{ city.display_name.split(',')[0] }}</div>
          <div class="text-xs text-text/60 truncate">{{ city.display_name }}</div>
        </li>
      </ul>
    </div>
  </div>
</template>
