import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Progress } from './ui/progress'
import { ArrowLeft, Trophy, Star, Target, Calendar, TrendingUp, Award } from 'lucide-react'
import { User } from '../types/user'

interface ProgressTrackerProps {
  user: User
  onBack: () => void
}

// Mock data for progress tracking
const mockProgressData = {
  weeklyProgress: [
    { day: 'Mon', gestures: 2, points: 20 },
    { day: 'Tue', gestures: 3, points: 35 },
    { day: 'Wed', gestures: 1, points: 10 },
    { day: 'Thu', gestures: 4, points: 45 },
    { day: 'Fri', gestures: 2, points: 25 },
    { day: 'Sat', gestures: 3, points: 30 },
    { day: 'Sun', gestures: 2, points: 20 }
  ],
  achievements: [
    {
      id: 'first-gesture',
      name: 'First Steps',
      description: 'Complete your first gesture',
      icon: '🎯',
      earned: true,
      earnedDate: '2024-01-15'
    },
    {
      id: 'week-streak',
      name: 'Week Warrior',
      description: 'Practice for 7 days in a row',
      icon: '🔥',
      earned: true,
      earnedDate: '2024-01-20'
    },
    {
      id: 'gesture-master',
      name: 'Gesture Master',
      description: 'Master 10 different gestures',
      icon: '🏆',
      earned: false,
      earnedDate: null
    },
    {
      id: 'perfect-score',
      name: 'Perfect Performance',
      description: 'Get 100% accuracy on a gesture',
      icon: '⭐',
      earned: true,
      earnedDate: '2024-01-18'
    },
    {
      id: 'speed-learner',
      name: 'Speed Learner',
      description: 'Complete 5 gestures in one day',
      icon: '⚡',
      earned: false,
      earnedDate: null
    },
    {
      id: 'helping-hand',
      name: 'Helping Hand',
      description: 'Practice for 30 days total',
      icon: '🤝',
      earned: false,
      earnedDate: null
    }
  ],
  categories: [
    { name: 'Greetings', completed: 3, total: 5, progress: 60 },
    { name: 'Responses', completed: 1, total: 4, progress: 25 },
    { name: 'Emotions', completed: 0, total: 6, progress: 0 },
    { name: 'Numbers', completed: 0, total: 10, progress: 0 },
    { name: 'Family', completed: 0, total: 8, progress: 0 }
  ]
}

export default function ProgressTracker({ user, onBack }: ProgressTrackerProps) {
  const [selectedTab, setSelectedTab] = useState<'overview' | 'achievements' | 'categories'>('overview')

  const totalGesturesThisWeek = mockProgressData.weeklyProgress.reduce((sum, day) => sum + day.gestures, 0)
  const totalPointsThisWeek = mockProgressData.weeklyProgress.reduce((sum, day) => sum + day.points, 0)
  const earnedAchievements = mockProgressData.achievements.filter(a => a.earned).length

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            onClick={onBack}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
          
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              📊 Your Progress
            </h1>
            <p className="text-lg text-gray-600">
              Track your BSL learning journey
            </p>
          </div>
          
          <div className="w-24"></div> {/* Spacer for centering */}
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-100 p-1 rounded-lg">
            <Button
              onClick={() => setSelectedTab('overview')}
              variant={selectedTab === 'overview' ? 'default' : 'ghost'}
              size="sm"
            >
              Overview
            </Button>
            <Button
              onClick={() => setSelectedTab('achievements')}
              variant={selectedTab === 'achievements' ? 'default' : 'ghost'}
              size="sm"
            >
              Achievements
            </Button>
            <Button
              onClick={() => setSelectedTab('categories')}
              variant={selectedTab === 'categories' ? 'default' : 'ghost'}
              size="sm"
            >
              Categories
            </Button>
          </div>
        </div>

        {/* Overview Tab */}
        {selectedTab === 'overview' && (
          <div className="space-y-8">
            {/* Weekly Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm">This Week</p>
                      <p className="text-3xl font-bold">{totalGesturesThisWeek}</p>
                      <p className="text-blue-100 text-sm">Gestures Practiced</p>
                    </div>
                    <Target className="h-12 w-12 text-blue-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm">Points Earned</p>
                      <p className="text-3xl font-bold">{totalPointsThisWeek}</p>
                      <p className="text-green-100 text-sm">This Week</p>
                    </div>
                    <Star className="h-12 w-12 text-green-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 text-sm">Current Streak</p>
                      <p className="text-3xl font-bold">7</p>
                      <p className="text-purple-100 text-sm">Days</p>
                    </div>
                    <TrendingUp className="h-12 w-12 text-purple-200" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Weekly Activity Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Weekly Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockProgressData.weeklyProgress.map((day, index) => (
                    <div key={day.day} className="flex items-center gap-4">
                      <div className="w-12 text-sm font-medium text-gray-600">
                        {day.day}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm text-gray-600">
                            {day.gestures} gestures
                          </span>
                          <span className="text-sm text-gray-400">•</span>
                          <span className="text-sm text-gray-600">
                            {day.points} points
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full transition-all duration-300"
                            style={{ width: `${(day.gestures / 5) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Achievements Tab */}
        {selectedTab === 'achievements' && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full">
                <Trophy className="h-5 w-5" />
                <span className="font-semibold">
                  {earnedAchievements} of {mockProgressData.achievements.length} achievements earned
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockProgressData.achievements.map((achievement) => (
                <Card
                  key={achievement.id}
                  className={`transition-all duration-200 ${
                    achievement.earned
                      ? 'bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 shadow-lg'
                      : 'bg-gray-50 border-gray-200 opacity-60'
                  }`}
                >
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl mb-4">{achievement.icon}</div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {achievement.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      {achievement.description}
                    </p>
                    {achievement.earned ? (
                      <Badge className="bg-yellow-500 text-white">
                        <Award className="h-3 w-3 mr-1" />
                        Earned {new Date(achievement.earnedDate!).toLocaleDateString()}
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-gray-500">
                        Not earned yet
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Categories Tab */}
        {selectedTab === 'categories' && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <p className="text-lg text-gray-600">
                Track your progress across different BSL categories
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mockProgressData.categories.map((category) => (
                <Card key={category.name}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{category.name}</span>
                      <Badge variant="outline">
                        {category.completed}/{category.total}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm text-gray-600 mb-2">
                          <span>Progress</span>
                          <span>{category.progress}%</span>
                        </div>
                        <Progress value={category.progress} className="h-3" />
                      </div>
                      <p className="text-sm text-gray-600">
                        {category.completed > 0
                          ? `Great progress! You've mastered ${category.completed} gestures in this category.`
                          : 'Ready to start learning gestures in this category?'
                        }
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}