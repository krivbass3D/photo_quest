<script setup lang="ts">
defineProps<{
  modelValue: string
  options: { value: string; label: string }[]
  label?: string
}>()

defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()
</script>

<template>
  <div class="vintage-select-group">
    <label v-if="label" class="vintage-label">{{ label }}</label>
    <div class="relative">
      <select
        :value="modelValue"
        class="vintage-select"
        @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
      >
        <option v-for="opt in options" :key="opt.value" :value="opt.value">
          {{ opt.label }}
        </option>
      </select>
      <div class="select-arrow">▼</div>
    </div>
  </div>
</template>

<style scoped>
.vintage-label {
  @apply block text-xs sm:text-sm font-bold uppercase tracking-wider text-secondary mb-2;
}

.vintage-select {
  @apply w-full bg-surface border-2 border-text text-text font-serif text-base sm:text-lg p-3 pr-10 outline-none appearance-none rounded-none cursor-pointer transition-all;
  box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.1);
}

.vintage-select:focus {
  @apply border-primary;
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0 rgba(0, 0, 0, 0.1);
}

.select-arrow {
  @apply absolute right-4 top-1/2 transform -translate-y-1/2 text-text pointer-events-none text-xs;
}
</style>
