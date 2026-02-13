import { defineStore } from 'pinia'
import { supabase } from '@/lib/supabase/client'
import type { GeneratedQuest, QuestTask } from '@/api/ai/types'

interface QuestState {
  currentQuest: GeneratedQuest | null
  currentTaskIndex: number
  score: number
  isLoading: boolean
  error: string | null
}

export const useQuestStore = defineStore('quest', {
  state: (): QuestState => ({
    currentQuest: null,
    currentTaskIndex: 0,
    score: 0,
    isLoading: false,
    error: null,
  }),

  getters: {
    currentTask: (state): QuestTask | null => {
      if (!state.currentQuest || !state.currentQuest.tasks) return null
      return state.currentQuest.tasks[state.currentTaskIndex] || null
    },
    isLastTask: (state): boolean => {
      if (!state.currentQuest) return true
      return state.currentTaskIndex === state.currentQuest.tasks.length - 1
    },
    progress: (state): number => {
      if (!state.currentQuest) return 0
      return Math.round(((state.currentTaskIndex) / state.currentQuest.tasks.length) * 100)
    }
  },

  actions: {
    async createQuest(params: { city: string, duration: number, transport: string, difficulty: string, genre: string, pois: any[] }) {
      this.isLoading = true
      this.error = null
      try {
        const { data, error } = await supabase.functions.invoke('generate-quest', {
          body: params
        })

        if (error) throw error
        
        this.currentQuest = { ...data, city: params.city } as GeneratedQuest
        this.currentTaskIndex = 0
        this.score = 0
      } catch (err: any) {
        this.error = err.message || 'Failed to generate quest'
        console.error(err)
      } finally {
        this.isLoading = false
      }
    },

    async validateTaskPhoto(taskId: string, photoBase64: string) {
      const task = this.currentQuest?.tasks.find(t => t.id === taskId)
      if (!task) return { success: false, feedback: 'Task not found' }
      
      this.isLoading = true
      try {
        const { data, error } = await supabase.functions.invoke('validate-photo', {
          body: {
            taskDescription: task.description,
            location: task.location,
            photoBase64
          }
        })

        if (error) throw error

        if (data.success) {
          task.isCompleted = true
          this.score += task.points
        }

        return data
      } catch (err: any) {
        this.error = err.message || 'Failed to validate photo'
        return { success: false, feedback: 'Error validating photo' }
      } finally {
        this.isLoading = false
      }
    },

    nextTask() {
      if (!this.isLastTask) {
        this.currentTaskIndex++
      }
    },

    resetQuest() {
      this.currentQuest = null
      this.currentTaskIndex = 0
      this.score = 0
    }
  }
})
