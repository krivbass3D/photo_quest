import type { RouteRecordRaw } from 'vue-router'

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
  },
  {
    path: '/setup',
    name: 'setup',
    component: () => import('@/views/QuestSetupView.vue'),
  },
  {
    path: '/quest',
    name: 'quest',
    component: () => import('@/views/QuestActiveView.vue'),
  },
  {
    path: '/rewards',
    name: 'rewards',
    component: () => import('@/views/RewardsView.vue'),
  },
]
