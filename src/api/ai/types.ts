export interface AIResponse {
  success: boolean
  feedback: string
  data?: any
  error?: string
}

export interface QuestTask {
  id: string
  title: string
  description: string
  hint: string
  location: string
  points: number
  isCompleted?: boolean
}

export interface GeneratedQuest {
  id: string
  city: string
  theme: string
  tasks: QuestTask[]
}
