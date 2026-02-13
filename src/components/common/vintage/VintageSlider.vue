<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  modelValue: number
  min: number
  max: number
  step: number
  label?: string
  formatValue?: (val: number) => string
}>()

defineEmits<{
  (e: 'update:modelValue', value: number): void
}>()

const steps = computed(() => {
  const count = (props.max - props.min) / props.step
  return Array.from({ length: count + 1 }, (_, i) => props.min + i * props.step)
})
</script>

<template>
  <div class="vintage-slider-group">
    <label v-if="label" class="vintage-label">{{ label }}</label>

    <div class="slider-container">
      <input
        :value="modelValue"
        type="range"
        :min="min"
        :max="max"
        :step="step"
        class="vintage-slider"
        @input="$emit('update:modelValue', Number(($event.target as HTMLInputElement).value))"
      />

      <div class="slider-ticks">
        <span v-for="val in steps" :key="val" class="tick">{{ val }}</span>
      </div>
    </div>

    <div class="current-value">
      {{ formatValue ? formatValue(modelValue) : modelValue }}
    </div>
  </div>
</template>

<style scoped>
.vintage-label {
  @apply block text-xs sm:text-sm font-bold uppercase tracking-wider text-secondary mb-2;
}

.vintage-slider {
  @apply w-full h-2 bg-text/10 rounded-full appearance-none cursor-pointer accent-primary border border-text/20;
}

.slider-ticks {
  @apply flex justify-between text-[0.6rem] font-bold text-text/40 mt-2 font-mono px-1;
}

.current-value {
  @apply text-center mt-2 font-serif text-2xl text-primary font-bold;
}
</style>
