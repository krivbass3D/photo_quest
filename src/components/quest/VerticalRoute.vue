<script setup lang="ts">
defineProps<{
  totalSteps: number
  currentStepIndex: number
}>()
</script>

<template>
  <div class="flex flex-col items-center h-full py-4 relative">
    <!-- Vertical Line -->
    <div class="absolute top-4 bottom-4 w-0.5 bg-ink/20 z-0"></div>

    <!-- Steps -->
    <div
      v-for="index in totalSteps"
      :key="index"
      class="relative z-10 mb-8 last:mb-0 flex flex-col items-center"
    >
      <!-- Circle Marker -->
      <div
        class="w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-500 bg-paper"
        :class="[
          index - 1 <= currentStepIndex
            ? 'border-ink text-ink font-bold'
            : 'border-ink/20 text-ink/20',
          index - 1 === currentStepIndex
            ? 'scale-110 shadow-lg border-stamp-red text-stamp-red'
            : '',
        ]"
      >
        <span class="text-xs font-display">{{ index.toString().padStart(2, '0') }}</span>
      </div>

      <!-- Connective active line segment overriding the background line -->
      <div v-if="index - 1 < currentStepIndex" class="absolute top-8 w-0.5 h-8 bg-ink -z-10"></div>
    </div>
  </div>
</template>
