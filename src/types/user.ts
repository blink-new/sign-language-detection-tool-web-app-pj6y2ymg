export interface User {
  id: string
  email: string
  displayName?: string
  level: number
  totalPoints: number
  completedGestures: string[]
  currentStreak: number
  badges: string[]
}