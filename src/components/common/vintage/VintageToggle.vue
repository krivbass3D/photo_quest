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
  <div class="vintage-toggle-group">
    <label v-if="label" class="vintage-label">{{ label }}</label>
    <div class="toggle-container">
      <button
        v-for="opt in options"
        :key="opt.value"
        type="button"
        :class="['toggle-btn', modelValue === opt.value ? 'active' : 'inactive']"
        @click="$emit('update:modelValue', opt.value)"
      >
        {{ opt.label }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.vintage-label {
  @apply block text-xs sm:text-sm font-bold uppercase tracking-wider text-secondary mb-2;
}

.toggle-container {
  @apply flex border-2 border-text bg-surface overflow-hidden;
  box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.1);
}

.toggle-btn {
  @apply flex-1 py-3 text-xs sm:text-sm font-bold uppercase tracking-wide transition-all border-r-2 border-text last:border-r-0;
}

.toggle-btn.active {
  @apply bg-primary text-background;
}

.toggle-btn.inactive {
  @apply hover:bg-text/5 text-text/60;
}
</style>
