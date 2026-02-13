import { GoogleGenerativeAI } from '@google/generative-ai'
import { env } from '@/config/env'

const genAI = new GoogleGenerativeAI(env.ai.geminiKey)

/**
 * Initialize and get a model instance
 * @param modelName - Default to gemini-1.5-flash
 */
export const getGeminiModel = (modelName = 'gemini-1.5-flash') => {
  return genAI.getGenerativeModel({ model: modelName })
}

/**
 * Common content generation helper
 */
export const generateContent = async (prompt: string, modelName = 'gemini-1.5-flash') => {
  try {
    const model = getGeminiModel(modelName)
    const result = await model.generateContent(prompt)
    const response = await result.response
    return response.text()
  } catch (error) {
    console.error('Gemini content generation failed:', error)
    throw error
  }
}
