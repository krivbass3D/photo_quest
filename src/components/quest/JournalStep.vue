<script setup lang="ts">
import { ref } from 'vue'
import type { QuestTask } from '@/api/ai/types'
import { useQuestStore } from '@/stores/quest'

const props = defineProps<{
  task: QuestTask
  index: number
  isActive: boolean
}>()

const store = useQuestStore()
const fileInput = ref<HTMLInputElement | null>(null)
const isUploading = ref(false)
const showHint = ref(false)
const resultData = ref<{ success?: boolean; feedback?: string; hint?: string } | null>(null)

// Actions
const triggerUpload = () => fileInput.value?.click()
const toggleHint = () => {
  showHint.value = !showHint.value
}

const handleFileUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  if (!target.files?.length) return

  const file = target.files[0]
  isUploading.value = true
  resultData.value = null

  const reader = new FileReader()
  reader.onload = async (e) => {
    const result = e.target?.result as string
    const base64 = result.split(',')[1]

    const response = await store.validateTaskPhoto(props.task.id, base64)
    resultData.value = response
    isUploading.value = false
  }
  reader.readAsDataURL(file)
}
</script>

<template>
  <div
    class="relative p-4 sm:p-8 transition-all duration-500"
    :class="
      isActive ? 'opacity-100 scale-100' : 'opacity-50 scale-95 blur-[1px] pointer-events-none'
    "
  >
    <!-- Paper Sheet Background -->
    <div
      class="absolute inset-0 bg-paper shadow-2xl skew-y-1 transform origin-top-left -z-10 border border-ink/10"
    ></div>

    <!-- Header: Step Number & Title -->
    <div class="flex flex-col mb-4 sm:mb-6 border-b-2 border-ink/10 pb-4">
      <span class="font-display text-ink/40 text-xs sm:text-sm tracking-[0.2em] mb-1"
        >STEP {{ (index + 1).toString().padStart(2, '0') }}</span
      >
      <h2 class="font-display text-xl sm:text-3xl text-ink uppercase leading-tight">
        {{ task.title }}
      </h2>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
      <!-- Left Column: Narrative & Task -->
      <div class="space-y-4 sm:space-y-6">
        <!-- Narrative -->
        <p class="font-journal text-lg sm:text-xl leading-relaxed text-ink/80 italic">
          "{{ task.narrative || task.description }}"
        </p>

        <!-- Task Instruction Box -->
        <div class="border-l-4 border-gold pl-4 py-2 bg-gold/10">
          <h3 class="font-display text-[0.6rem] sm:text-xs font-bold text-ink uppercase tracking-widest mb-1 sm:mb-2">
            Fotografische Aufgabe
          </h3>
          <p class="font-sans text-xs sm:text-sm text-ink font-bold">{{ task.instruction || task.description }}</p>
        </div>

        <!-- Hint Envelope -->
        <div class="relative mt-2 sm:mt-4">
          <button
            v-if="!showHint"
            class="text-[0.6rem] sm:text-xs font-bold uppercase tracking-widest text-stamp-red border-b border-stamp-red/30 hover:text-ink transition-colors flex items-center gap-2"
            @click="toggleHint"
          >
            <span>🔍 Hinweis öffnen</span>
            <span class="text-[0.5rem] sm:text-[0.6rem] opacity-50">(-5 Reputation)</span>
          </button>

          <div
            v-else
            class="bg-surface p-3 sm:p-4 border border-ink/10 relative animate-fade-in shadow-inner"
          >
            <span class="absolute -top-2 left-4 text-lg">📎</span>
            <p class="font-hand text-xs sm:text-sm text-ink/70">
              {{ task.hint || 'Schaue genau auf die Details der Architektur...' }}
            </p>
          </div>
        </div>
      </div>

      <!-- Right Column: Evidence Photo Slot -->
      <div class="relative max-w-sm mx-auto w-full lg:max-w-none">
        <!-- Photo Frame (Tilted) -->
        <div
          class="bg-white p-2 sm:p-3 pb-6 sm:pb-8 shadow-xl rotate-2 transition-transform hover:rotate-1 cursor-pointer relative group"
          @click="!task.isCompleted && triggerUpload()"
        >
          <!-- The Photo Area -->
          <div
            class="aspect-[4/5] bg-gray-100 inner-shadow relative overflow-hidden flex items-center justify-center"
          >
            <input
              ref="fileInput"
              type="file"
              accept="image/*"
              class="hidden"
              :disabled="task.isCompleted"
              @change="handleFileUpload"
            />

            <!-- Placeholder / Loader -->
            <div v-if="!task.isCompleted" class="text-center p-4">
              <div v-if="isUploading" class="animate-pulse font-display text-ink/50 text-xs sm:text-base">
                WIRD ENTWICKELT...
              </div>
              <div
                v-else
                class="flex flex-col items-center gap-1 sm:gap-2 text-ink/20 group-hover:text-ink/40 transition-colors"
              >
                <span class="text-3xl sm:text-4xl">📷</span>
                <span class="font-display text-[0.6rem] sm:text-xs tracking-widest">Beweisfoto</span>
              </div>
            </div>

            <!-- Success State -->
            <div
              v-if="task.isCompleted"
              class="absolute inset-0 bg-secondary/10 flex items-center justify-center"
            >
              <span class="text-5xl sm:text-6xl grayscale opacity-50">🖼️</span>
            </div>
          </div>

          <!-- Caption -->
          <div class="mt-2 sm:mt-4 text-center font-hand text-ink/60 text-xs sm:text-sm">
            Beweisstück Nr. {{ (index + 1).toString().padStart(2, '0') }}
          </div>

          <!-- STAMP ANIMATION OVERLAY -->
          <div
            v-if="task.isCompleted"
            class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-2 sm:border-4 border-stamp-red text-stamp-red font-display font-black text-xl sm:text-2xl uppercase p-1 sm:p-2 -rotate-12 opacity-80 mix-blend-multiply animate-stamp-in whitespace-nowrap mask-grunge"
          >
            ✔ BESTÄTIGT
          </div>
          <!-- FAIL STAMP -->
          <div
            v-if="resultData && !resultData.success"
            class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-2 sm:border-4 border-ink text-ink font-display font-black text-xl sm:text-2xl uppercase p-1 sm:p-2 rotate-12 opacity-90 mix-blend-multiply animate-stamp-in bg-paper"
          >
            ABGELEHNT
          </div>
        </div>

        <!-- Feedback Text below photo -->
        <div
          v-if="resultData && !resultData.success"
          class="mt-4 sm:mt-8 font-hand text-[0.6rem] sm:text-xs text-red-800 text-center bg-red-100/50 p-2 rotate-1"
        >
          "{{ resultData.feedback }}"
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.inner-shadow {
  box-shadow: inset 0 2px 10px rgba(0, 0, 0, 0.1);
}

.animate-stamp-in {
  animation: stampIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
}

@keyframes stampIn {
  0% {
    transform: translate(-50%, -50%) scale(2) rotate(-20deg);
    opacity: 0;
  }
  100% {
    transform: translate(-50%, -50%) scale(1) rotate(-12deg);
    opacity: 0.8;
  }
}

/* Grunge mask approximation using text-shadow - for real app use SVG mask */
.mask-grunge {
  text-shadow: 1px 1px 0 rgba(255, 255, 255, 0.4);
}
</style>
