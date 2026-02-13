<script setup lang="ts">
defineProps<{
  modelValue: string | number
  label?: string
  placeholder?: string
  type?: string
}>()

defineEmits<{
  (e: 'update:modelValue', value: string | number): void
}>()
</script>

<template>
  <div class="vintage-input-group">
    <label v-if="label" class="vintage-label">{{ label }}</label>
    <input
      :value="modelValue"
      :type="type || 'text'"
      :placeholder="placeholder"
      class="vintage-input"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
  </div>
</template>

<style scoped>
.vintage-label {
  @apply block text-xs sm:text-sm font-bold uppercase tracking-wider text-secondary mb-2;
}

.vintage-input {
  @apply w-full bg-background border-b-2 border-text/20 text-text font-serif text-lg sm:text-xl p-2 outline-none transition-colors placeholder:text-text/30;
  background-image: linear-gradient(to bottom, transparent 95%, rgba(0, 0, 0, 0.05) 95%);
  background-size: 100% 2rem;
}

.vintage-input:focus {
  @apply border-primary;
}
</style>
