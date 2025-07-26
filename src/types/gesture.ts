export interface Gesture {
  id: string
  name: string
  description: string
  difficulty: 'easy' | 'medium' | 'hard'
  category: string
  videoUrl?: string
  imageUrl: string
  instructions: string[]
  keyPoints: string[]
  unlocked: boolean
  completed: boolean
  points: number
}