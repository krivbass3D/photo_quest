<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useQuestStore } from '@/stores/quest'

const router = useRouter()
const store = useQuestStore()
const quest = computed(() => store.currentQuest)

const today = new Date().toLocaleDateString('de-DE', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
})

const goHome = () => {
  store.resetQuest()
  router.push('/')
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center p-4 sm:p-8 overflow-y-auto">
    <div
      class="vintage-card bg-[#F9F6EE] border-[12px] border-double border-[#8B4513]/20 shadow-2xl max-w-2xl w-full p-8 sm:p-16 relative overflow-hidden"
    >
      <!-- Decorative Border Lines -->
      <div class="absolute inset-4 border-2 border-[#8B4513]/10 pointer-events-none"></div>

      <!-- Content -->
      <div class="relative z-10 text-center space-y-8 flex flex-col items-center">
        <!-- Header -->
        <div class="space-y-2">
          <h2 class="vintage-header text-lg sm:text-xl text-[#8B4513]/60 tracking-[0.4em]">
            {{ $t('rewards.certificate_title') }}
          </h2>
          <div class="w-16 h-px bg-[#8B4513]/30 mx-auto"></div>
        </div>

        <!-- Seal/Badge (Pure CSS Stamp) -->
        <div
          class="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-dashed border-primary/40 flex items-center justify-center rotate-12 bg-primary/5 shadow-inner my-4"
        >
          <div
            class="text-center font-black uppercase tracking-tighter text-primary/60 leading-none"
          >
            <div class="text-[0.6rem] sm:text-xs">Offiziell</div>
            <div class="text-lg sm:text-2xl mt-1">BESTANDEN</div>
            <div class="text-[0.6rem] sm:text-xs mt-1">EST. 2026</div>
          </div>
        </div>

        <!-- Body Text -->
        <div class="space-y-6">
          <p class="font-serif text-2xl sm:text-3xl text-text leading-tight italic">
            {{ $t('rewards.certificate_body') }}
          </p>

          <div class="w-24 h-[2px] bg-primary mx-auto"></div>

          <p
            v-if="quest"
            class="text-lg sm:text-xl font-bold uppercase tracking-widest text-[#8B4513]/80"
          >
            "{{ quest.theme }}"
          </p>
        </div>

        <!-- Bottom Details (Grid Style) -->
        <div class="grid grid-cols-2 gap-8 w-full border-t border-b border-[#8B4513]/10 py-8 mt-8">
          <div class="text-left space-y-1">
            <div class="text-[0.6rem] font-bold uppercase tracking-widest text-text/40">
              {{ $t('rewards.date') }}
            </div>
            <div class="font-mono text-sm sm:text-base border-b border-[#8B4513]/20 pb-1">
              {{ today }}
            </div>
          </div>
          <div class="text-left space-y-1">
            <div class="text-[0.6rem] font-bold uppercase tracking-widest text-text/40">
              {{ $t('rewards.location') }}
            </div>
            <div class="font-mono text-sm sm:text-base border-b border-[#8B4513]/20 pb-1">
              DEUTSCHLAND
            </div>
          </div>
        </div>

        <!-- Signature Section -->
        <div class="w-full flex justify-end pt-4">
          <div class="text-center">
            <div class="font-handwriting text-2xl text-secondary rotate-[-2deg] mb-1">
              PhotoQuest AI
            </div>
            <div class="w-24 h-px bg-[#8B4513]/40 mx-auto"></div>
            <div class="text-[0.5rem] font-bold uppercase tracking-widest text-text/30 mt-1">
              {{ $t('rewards.signature') }}
            </div>
          </div>
        </div>

        <!-- Action Button -->
        <button class="mt-12 group relative inline-block focus:outline-none" @click="goHome">
          <span
            class="relative z-10 block bg-[#1A2C42] text-white text-xs sm:text-sm font-bold uppercase tracking-[0.2em] px-8 py-4 border-2 border-white transform group-hover:-translate-y-1 transition-transform duration-200"
          >
            {{ $t('rewards.back_home') }}
          </span>
          <span
            class="absolute top-0 left-0 w-full h-full bg-[#8B4513]/20 transform translate-y-2 translate-x-2"
          ></span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.font-handwriting {
  font-family: 'Brush Script MT', cursive;
}
.vintage-card {
  background-image: radial-gradient(#8b451305 1px, transparent 0);
  background-size: 20px 20px;
}
</style>
