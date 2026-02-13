<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  modelValue: string[]
  value: string
  label?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string[]): void
}>()

const isChecked = computed(() => props.modelValue.includes(props.value))

const toggle = () => {
  const newValue = [...props.modelValue]
  if (isChecked.value) {
    const index = newValue.indexOf(props.value)
    newValue.splice(index, 1)
  } else {
    newValue.push(props.value)
  }
  emit('update:modelValue', newValue)
}
</script>

<template>
  <div class="vintage-checkbox group" :class="{ checked: isChecked }" @click="toggle">
    <div class="checkbox-box">
      <span v-if="isChecked" class="checkmark">✓</span>
    </div>
    <span v-if="label" class="checkbox-label">{{ label }}</span>
  </div>
</template>

<style scoped>
.vintage-checkbox {
  @apply flex items-center cursor-pointer select-none space-x-3 p-2 border border-transparent rounded hover:bg-surface/50 transition-colors;
}

.checkbox-box {
  @apply w-6 h-6 border-2 border-text bg-background flex items-center justify-center transition-all relative;
  box-shadow: 2px 2px 0 rgba(0, 0, 0, 0.1);
}

.vintage-checkbox:active .checkbox-box {
  transform: translate(1px, 1px);
  box-shadow: 1px 1px 0 rgba(0, 0, 0, 0.1);
}

.checked .checkbox-box {
  @apply bg-primary border-primary;
}

.checkmark {
  @apply text-background font-bold text-lg;
}

.checkbox-label {
  @apply font-serif text-base text-text/80 group-hover:text-text;
}
</style>
