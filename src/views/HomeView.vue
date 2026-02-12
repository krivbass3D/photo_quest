<script setup lang="ts">
// Minimal HomeView for initial setup
</script>

<template>
  <main class="flex flex-col items-center justify-center p-8 bg-background min-h-screen">
    <h1 class="text-4xl font-bold text-primary mb-4">{{ $t('home.title') }}</h1>
    <p class="text-text text-lg text-center max-w-md">
      {{ $t('home.subtitle') }}
    </p>
    <router-link
      to="/setup"
      class="mt-8 bg-primary text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors"
    >
      {{ $t('home.startButton') }}
    </router-link>
  </main>
</template>
