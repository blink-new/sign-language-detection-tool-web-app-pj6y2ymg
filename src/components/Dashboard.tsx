import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Progress } from './ui/progress'
import { Trophy, Star, Target, Play, Lock, CheckCircle } from 'lucide-react'
import { User } from '../types/user'
import { Gesture } from '../types/gesture'

interface DashboardProps {
  user: User
  onStartPractice: (gesture: Gesture) => void
  onViewProgress: () => void
}

// Sample BSL gestures data
const sampleGestures: Gesture[] = [
  {
    id: 'hello',
    name: 'Hello',
    description: 'A friendly greeting gesture',
    difficulty: 'easy',
    category: 'Greetings',
    imageUrl: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400&h=300&fit=crop',
    instructions: [
      'Raise your dominant hand to shoulder height',
      'Keep your palm facing outward',
      'Wave gently from side to side'
    ],
    keyPoints: ['Open palm', 'Shoulder height', 'Gentle wave motion'],
    unlocked: true,
    completed: false,
    points: 10
  },
  {
    id: 'thank-you',
    name: 'Thank You',
    description: 'Express gratitude with this gesture',
    difficulty: 'easy',
    category: 'Greetings',
    imageUrl: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=400&h=300&fit=crop',
    instructions: [
      'Place your fingertips on your chin',
      'Move your hand forward and down',
      'End with palm facing up'
    ],
    keyPoints: ['Start at chin', 'Forward motion', 'Palm up finish'],
    unlocked: true,
    completed: false,
    points: 10
  },
  {
    id: 'please',
    name: 'Please',
    description: 'A polite request gesture',
    difficulty: 'easy',
    category: 'Greetings',
    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=300&fit=crop',
    instructions: [
      'Place your flat hand on your chest',
      'Make small circular motions',
      'Keep your palm against your chest'
    ],
    keyPoints: ['Flat hand', 'Chest placement', 'Circular motion'],
    unlocked: true,
    completed: false,
    points: 10
  },
  {
    id: 'yes',
    name: 'Yes',
    description: 'Affirmative response gesture',
    difficulty: 'medium',
    category: 'Responses',
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
    instructions: [
      'Make a fist with your dominant hand',
      'Nod your fist up and down',
      'Keep the motion clear and deliberate'
    ],
    keyPoints: ['Closed fist', 'Nodding motion', 'Clear movement'],
    unlocked: false,
    completed: false,
    points: 15
  },
  {
    id: 'no',
    name: 'No',
    description: 'Negative response gesture',
    difficulty: 'medium',
    category: 'Responses',
    imageUrl: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&h=300&fit=crop',
    instructions: [
      'Extend your index and middle fingers',
      'Tap them against your thumb',
      'Repeat the tapping motion'
    ],
    keyPoints: ['Two fingers extended', 'Thumb contact', 'Tapping rhythm'],
    unlocked: false,
    completed: false,
    points: 15
  },
  {
    id: 'love',
    name: 'Love',
    description: 'Express affection with this gesture',
    difficulty: 'hard',
    category: 'Emotions',
    imageUrl: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=400&h=300&fit=crop',
    instructions: [
      'Cross both arms over your chest',
      'Hug yourself gently',
      'Show a warm expression'
    ],
    keyPoints: ['Crossed arms', 'Self-hug', 'Warm expression'],
    unlocked: false,
    completed: false,
    points: 25
  }
]

export default function Dashboard({ user, onStartPractice, onViewProgress }: DashboardProps) {
  const [gestures, setGestures] = useState<Gesture[]>(sampleGestures)
  const [userStats, setUserStats] = useState({
    level: 1,
    totalPoints: 0,
    completedGestures: 0,
    currentStreak: 0
  })

  useEffect(() => {
    // In a real app, this would fetch user progress from the database
    const completedCount = gestures.filter(g => g.completed).length
    const totalPoints = completedCount * 10 // Simplified calculation
    
    setUserStats({
      level: Math.floor(totalPoints / 50) + 1,
      totalPoints,
      completedGestures: completedCount,
      currentStreak: 3 // Mock data
    })
  }, [gestures])

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'hard': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getProgressPercentage = () => {
    const completed = gestures.filter(g => g.completed).length
    return (completed / gestures.length) * 100
  }

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                🤟 BSL Learning Adventure
              </h1>
              <p className="text-lg text-gray-600">
                Welcome back! Ready to learn some new signs?
              </p>
            </div>
            <Button
              onClick={onViewProgress}
              variant="outline"
              className="hidden md:flex items-center gap-2"
            >
              <Trophy className="h-4 w-4" />
              View Progress
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Level</p>
                  <p className="text-2xl font-bold">{userStats.level}</p>
                </div>
                <Star className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Points</p>
                  <p className="text-2xl font-bold">{userStats.totalPoints}</p>
                </div>
                <Trophy className="h-8 w-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Completed</p>
                  <p className="text-2xl font-bold">{userStats.completedGestures}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">Streak</p>
                  <p className="text-2xl font-bold">{userStats.currentStreak}</p>
                </div>
                <Target className="h-8 w-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Progress Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" />
              Learning Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Overall Progress</span>
                  <span>{Math.round(getProgressPercentage())}% Complete</span>
                </div>
                <Progress value={getProgressPercentage()} className="h-3" />
              </div>
              <p className="text-sm text-gray-600">
                You've mastered {userStats.completedGestures} out of {gestures.length} gestures. Keep going!
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Gestures Grid */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Gestures</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gestures.map((gesture) => (
              <Card
                key={gesture.id}
                className={`overflow-hidden transition-all duration-200 hover:shadow-lg ${
                  !gesture.unlocked ? 'opacity-60' : 'hover:scale-105'
                }`}
              >
                <div className="relative">
                  <img
                    src={gesture.imageUrl}
                    alt={gesture.name}
                    className="w-full h-48 object-cover"
                  />
                  {gesture.completed && (
                    <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1">
                      <CheckCircle className="h-5 w-5" />
                    </div>
                  )}
                  {!gesture.unlocked && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <Lock className="h-8 w-8 text-white" />
                    </div>
                  )}
                </div>
                
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{gesture.name}</h3>
                    <Badge className={getDifficultyColor(gesture.difficulty)}>
                      {gesture.difficulty}
                    </Badge>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-3">{gesture.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {gesture.points} points
                    </span>
                    <Button
                      onClick={() => onStartPractice(gesture)}
                      disabled={!gesture.unlocked}
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <Play className="h-4 w-4" />
                      {gesture.completed ? 'Practice Again' : 'Start Learning'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}