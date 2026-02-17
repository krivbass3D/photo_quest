export interface AIResponse {
  success: boolean
  feedback: string
  data?: any
  error?: string
}

export interface QuestTask {
  id: string
  title: string
  description: string // Keeping for backward compatibility or as fallback
  narrative?: string // The story part
  instruction?: string // The specific task
  hint: string
  location: string
  points: number
  isCompleted?: boolean
  attempts?: number
  userPhoto?: string // Base64 or URL
}

export interface GeneratedQuest {
  id: string
  city: string
  theme: string
  intro?: string // Introduction story
  tasks: QuestTask[]
}
