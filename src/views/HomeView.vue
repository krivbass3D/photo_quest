<template>
  <main
    class="flex items-center justify-center min-h-screen p-4 sm:p-6 lg:p-8 bg-background overflow-y-auto"
  >
    <div
      class="vintage-border bg-surface/95 backdrop-blur-sm w-full max-w-lg lg:max-w-2xl shadow-xl relative overflow-hidden flex flex-col justify-center my-auto"
    >
      <!-- Decorative Corner Accents -->
      <div
        class="absolute top-0 left-0 w-8 h-8 sm:w-16 sm:h-16 border-t-4 border-l-4 border-primary m-2"
      ></div>
      <div
        class="absolute top-0 right-0 w-8 h-8 sm:w-16 sm:h-16 border-t-4 border-r-4 border-primary m-2"
      ></div>
      <div
        class="absolute bottom-0 left-0 w-8 h-8 sm:w-16 sm:h-16 border-b-4 border-l-4 border-primary m-2"
      ></div>
      <div
        class="absolute bottom-0 right-0 w-8 h-8 sm:w-16 sm:h-16 border-b-4 border-r-4 border-primary m-2"
      ></div>

      <div
        class="text-center py-8 px-4 sm:py-16 sm:px-8 flex flex-col items-center z-10 relative landscape:py-6 landscape:px-12"
      >
        <h1
          class="vintage-header text-4xl sm:text-5xl md:text-6xl text-primary mb-4 sm:mb-6 leading-tight drop-shadow-sm landscape:text-3xl landscape:mb-2 text-wrap"
        >
          {{ $t('home.title') }}
        </h1>

        <div class="w-16 sm:w-24 h-1 bg-text opacity-20 my-4 sm:my-6 landscape:my-2"></div>

        <p
          class="text-text text-base sm:text-xl md:text-2xl font-medium tracking-wide leading-relaxed max-w-xs sm:max-w-md mx-auto text-secondary/90 landscape:text-sm landscape:loading-snug landscape:max-w-full"
        >
          {{ $t('home.subtitle') }}
        </p>

        <router-link
          to="/setup"
          class="mt-6 sm:mt-12 group relative inline-block focus:outline-none landscape:mt-4"
        >
          <span
            class="relative z-10 block bg-primary text-background text-sm sm:text-lg font-bold uppercase tracking-widest px-6 py-3 sm:px-8 sm:py-4 border-2 border-text transform group-hover:-translate-y-1 transition-transform duration-200 landscape:py-2 landscape:text-sm"
          >
            {{ $t('home.startButton') }}
          </span>
          <span
            class="absolute top-0 left-0 w-full h-full bg-text transform translate-y-1 translate-x-1 sm:translate-y-2 sm:translate-x-2"
          ></span>
        </router-link>
      </div>

      <!-- Vintage footer text -->
      <div
        class="text-center pb-2 sm:pb-4 text-[0.6rem] sm:text-xs font-bold tracking-[0.2em] text-text/40 uppercase landscape:pb-2"
      >
        Est. 2026 • Deutschland
      </div>
    </div>
  </main>
</template>
