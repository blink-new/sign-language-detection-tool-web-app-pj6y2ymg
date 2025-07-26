import { useState, useEffect } from 'react'
import { createClient } from '@blinkdotnew/sdk'
import Dashboard from './components/Dashboard'
import GesturePractice from './components/GesturePractice'
import ProgressTracker from './components/ProgressTracker'
import { User } from './types/user'
import { Gesture } from './types/gesture'

const blink = createClient({
  projectId: 'sign-language-detection-tool-web-app-pj6y2ymg',
  authRequired: true
})

type AppView = 'dashboard' | 'practice' | 'progress'

function App() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentView, setCurrentView] = useState<AppView>('dashboard')
  const [selectedGesture, setSelectedGesture] = useState<Gesture | null>(null)

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      setLoading(state.isLoading)
    })
    return unsubscribe
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg font-medium text-gray-600">Loading BSL Learning Adventure...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">🤟 BSL Learning Adventure</h1>
            <p className="text-lg text-gray-600">Learn British Sign Language through interactive practice!</p>
          </div>
          <button
            onClick={() => blink.auth.login()}
            className="bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-8 rounded-xl transition-colors duration-200 shadow-lg hover:shadow-xl"
          >
            Start Learning BSL
          </button>
        </div>
      </div>
    )
  }

  const handleStartPractice = (gesture: Gesture) => {
    setSelectedGesture(gesture)
    setCurrentView('practice')
  }

  const handleBackToDashboard = () => {
    setCurrentView('dashboard')
    setSelectedGesture(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {currentView === 'dashboard' && (
        <Dashboard
          user={user}
          onStartPractice={handleStartPractice}
          onViewProgress={() => setCurrentView('progress')}
        />
      )}
      
      {currentView === 'practice' && selectedGesture && (
        <GesturePractice
          gesture={selectedGesture}
          user={user}
          onBack={handleBackToDashboard}
          onComplete={handleBackToDashboard}
        />
      )}
      
      {currentView === 'progress' && (
        <ProgressTracker
          user={user}
          onBack={handleBackToDashboard}
        />
      )}
    </div>
  )
}

export default App