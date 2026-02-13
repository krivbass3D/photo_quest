<script setup lang="ts">
import { ref } from 'vue'
import { useQuestStore } from '@/stores/quest'
import type { QuestTask } from '@/api/ai/types'

const props = defineProps<{
  task: QuestTask
  index: number
}>()

const store = useQuestStore()
const fileInput = ref<HTMLInputElement | null>(null)
const isUploading = ref(false)

const triggerUpload = () => {
  fileInput.value?.click()
}

const resultData = ref<{ success?: boolean; feedback?: string; hint?: string } | null>(null)

const handleFileUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  if (!target.files?.length) return

  const file = target.files[0]
  isUploading.value = true
  resultData.value = null

  // Convert to base64 for preview (and potential API usage)
  const reader = new FileReader()
  reader.onload = async (e) => {
    const result = e.target?.result as string
    const base64 = result.split(',')[1] // Get only the base64 part

    // Simulate validation for now or use the store action if ready
    const response = await store.validateTaskPhoto(props.task.id, base64)
    resultData.value = response
    isUploading.value = false
  }
  reader.readAsDataURL(file)
}
</script>

<template>
  <div
    class="vintage-card bg-white p-4 sm:p-6 shadow-md transform transition-transform hover:-translate-y-1 relative overflow-hidden border border-gray-200"
  >
    <!-- Paper texture & Tape -->
    <div
      class="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-8 bg-yellow-100/80 rotate-1 shadow-sm z-10 border-l border-r border-white/50 backdrop-blur-[1px]"
    ></div>

    <div class="relative z-0 flex flex-col sm:flex-row gap-6">
      <!-- Left: Task Info (Journal Style) -->
      <div class="flex-1">
        <div class="flex items-baseline gap-3 mb-2">
          <span class="text-3xl font-serif text-primary/40 font-bold">#{{ index + 1 }}</span>
          <h3 class="text-xl font-bold text-text uppercase tracking-wide">{{ task.title }}</h3>
        </div>

        <p
          class="text-secondary text-sm leading-relaxed font-medium mb-4 italic border-l-2 border-primary/20 pl-4"
        >
          "{{ task.description }}"
        </p>

        <div
          class="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-text/50"
        >
          <span
            class="inline-block w-2 h-2 rounded-full"
            :class="task.isCompleted ? 'bg-success' : 'bg-gray-300'"
          ></span>
          {{ task.isCompleted ? $t('quest.completed') : $t('quest.pending') }}
        </div>

        <!-- AI Feedback (if failed) -->
        <div
          v-if="resultData && !resultData.success"
          class="mt-4 p-3 bg-red-50 border-l-4 border-primary text-xs animate-fade-in"
        >
          <p class="font-bold text-primary uppercase mb-1">{{ $t('quest.feedback_label') }}</p>
          <p class="text-text italic">"{{ resultData.feedback }}"</p>
          <p v-if="resultData.hint" class="mt-2 text-secondary font-medium">
            💡 {{ resultData.hint }}
          </p>
        </div>
      </div>

      <!-- Right: Photo Slot (Polaroid Style) -->
      <div class="w-full sm:w-48 flex-shrink-0 flex flex-col">
        <div
          class="aspect-[4/5] bg-gray-100 p-3 shadow-inner border border-gray-200 flex items-center justify-center relative group cursor-pointer overflow-hidden transition-colors"
          :class="{
            'bg-green-50 border-success/30': task.isCompleted,
            'hover:bg-gray-50': !task.isCompleted,
          }"
          @click="!task.isCompleted && triggerUpload()"
        >
          <input
            ref="fileInput"
            type="file"
            accept="image/*"
            class="hidden"
            :disabled="task.isCompleted"
            @change="handleFileUpload"
          />

          <div
            v-if="task.isCompleted"
            class="absolute inset-0 z-10 flex items-center justify-center bg-success/10"
          >
            <div
              class="w-16 h-16 rounded-full border-4 border-success flex items-center justify-center -rotate-12 bg-white/80 shadow-lg"
            >
              <span class="text-2xl font-bold text-success">✓</span>
            </div>
          </div>

          <div v-else class="text-center p-4">
            <span v-if="isUploading" class="text-primary font-bold animate-pulse">{{
              $t('quest.uploading')
            }}</span>
            <template v-else>
              <div class="text-4xl text-gray-300 mb-2">📷</div>
              <span class="text-xs font-bold text-gray-400 uppercase tracking-wide">{{
                $t('quest.tap_to_photo')
              }}</span>
            </template>
          </div>
        </div>
        <div class="mt-2 text-center font-handwriting text-gray-400 text-sm rotate-1">
          {{ task.isCompleted ? 'Erinnerung festgehalten' : 'Hier Foto einkleben' }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.font-handwriting {
  font-family: 'Courier New', Courier, monospace; /* Placeholder for handwriting font */
}
</style>
