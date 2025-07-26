import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Progress } from './ui/progress'
import { ArrowLeft, Camera, CameraOff, CheckCircle, RotateCcw, Lightbulb } from 'lucide-react'
import { User } from '../types/user'
import { Gesture } from '../types/gesture'

interface GesturePracticeProps {
  gesture: Gesture
  user: User
  onBack: () => void
  onComplete: () => void
}

export default function GesturePractice({ gesture, user, onBack, onComplete }: GesturePracticeProps) {
  const [cameraActive, setCameraActive] = useState(false)
  const [cameraLoading, setCameraLoading] = useState(false)
  const [isDetecting, setIsDetecting] = useState(false)
  const [detectionProgress, setDetectionProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)
  const [showHints, setShowHints] = useState(false)
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  useEffect(() => {
    return () => {
      // Cleanup camera stream when component unmounts
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    setCameraActive(false)
    setCameraLoading(false)
  }

  const startCamera = async () => {
    setCameraLoading(true)
    try {
      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera access is not supported in this browser')
      }

      // Check for HTTPS requirement
      if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
        throw new Error('Camera access requires HTTPS connection')
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        }
      })
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        streamRef.current = stream
        
        // Wait for video to load before setting camera as active
        videoRef.current.onloadedmetadata = () => {
          console.log('Camera loaded successfully')
          setCameraActive(true)
          setCameraLoading(false)
        }
        
        // Handle video errors
        videoRef.current.onerror = (error) => {
          console.error('Video error:', error)
          stopCamera()
        }
        
        // Also handle the case where metadata doesn't load
        setTimeout(() => {
          if (cameraLoading && streamRef.current) {
            console.log('Camera timeout - setting active anyway')
            setCameraActive(true)
            setCameraLoading(false)
          }
        }, 5000)
      }
    } catch (error: any) {
      console.error('Error accessing camera:', error)
      setCameraLoading(false)
      
      let errorMessage = 'Unable to access camera. '
      
      if (error.name === 'NotAllowedError') {
        errorMessage += 'Please allow camera permissions and try again. You may need to click the camera icon in your browser\'s address bar.'
      } else if (error.name === 'NotFoundError') {
        errorMessage += 'No camera found on this device.'
      } else if (error.name === 'NotSupportedError') {
        errorMessage += 'Camera is not supported in this browser.'
      } else if (error.message.includes('HTTPS')) {
        errorMessage += 'Camera access requires a secure connection (HTTPS).'
      } else {
        errorMessage += 'Please check your camera settings and try again.'
      }
      
      alert(errorMessage)
    }
  }

  const startDetection = () => {
    setIsDetecting(true)
    setDetectionProgress(0)
    
    // Simulate gesture detection progress
    const interval = setInterval(() => {
      setDetectionProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsDetecting(false)
          setIsCompleted(true)
          return 100
        }
        return prev + Math.random() * 15 + 5 // Random progress increment
      })
    }, 200)
  }

  const resetPractice = () => {
    setDetectionProgress(0)
    setIsDetecting(false)
    setIsCompleted(false)
    setCurrentStep(0)
  }

  const nextStep = () => {
    if (currentStep < gesture.instructions.length - 1) {
      setCurrentStep(currentStep + 1)
      setDetectionProgress(0)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      setDetectionProgress(0)
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'hard': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            onClick={onBack}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
          
          <div className="text-center">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Learning: {gesture.name}
            </h1>
            <Badge className={getDifficultyColor(gesture.difficulty)}>
              {gesture.difficulty}
            </Badge>
          </div>
          
          <Button
            onClick={() => setShowHints(!showHints)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Lightbulb className="h-4 w-4" />
            Hints
          </Button>
        </div>

        {/* Success Message */}
        {isCompleted && (
          <Card className="mb-6 bg-gradient-to-r from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6 text-center">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-green-800 mb-2">
                Excellent Work! 🎉
              </h2>
              <p className="text-green-700 mb-4">
                You've successfully performed the "{gesture.name}" gesture!
              </p>
              <div className="flex gap-4 justify-center">
                <Button onClick={resetPractice} variant="outline">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Practice Again
                </Button>
                <Button onClick={onComplete} className="bg-green-600 hover:bg-green-700">
                  Continue Learning
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gesture Information */}
          <div className="space-y-6">
            {/* Gesture Example */}
            <Card>
              <CardHeader>
                <CardTitle>Gesture Example</CardTitle>
              </CardHeader>
              <CardContent>
                <img
                  src={gesture.imageUrl}
                  alt={gesture.name}
                  className="w-full h-64 object-cover rounded-lg mb-4"
                />
                <p className="text-gray-600">{gesture.description}</p>
              </CardContent>
            </Card>

            {/* Instructions */}
            <Card>
              <CardHeader>
                <CardTitle>Step-by-Step Instructions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {gesture.instructions.map((instruction, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border-2 transition-colors ${
                        index === currentStep
                          ? 'border-primary bg-primary/5'
                          : index < currentStep
                          ? 'border-green-300 bg-green-50'
                          : 'border-gray-200 bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                            index === currentStep
                              ? 'bg-primary text-white'
                              : index < currentStep
                              ? 'bg-green-500 text-white'
                              : 'bg-gray-300 text-gray-600'
                          }`}
                        >
                          {index < currentStep ? '✓' : index + 1}
                        </div>
                        <p className="text-gray-800">{instruction}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2 mt-4">
                  <Button
                    onClick={prevStep}
                    disabled={currentStep === 0}
                    variant="outline"
                    size="sm"
                  >
                    Previous Step
                  </Button>
                  <Button
                    onClick={nextStep}
                    disabled={currentStep === gesture.instructions.length - 1}
                    variant="outline"
                    size="sm"
                  >
                    Next Step
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Hints Panel */}
            {showHints && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-yellow-500" />
                    Key Points
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {gesture.keyPoints.map((point, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                        <span className="text-gray-700">{point}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Camera Practice */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="h-5 w-5" />
                  Practice with Camera
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative bg-gray-900 rounded-lg overflow-hidden mb-4">
                  {cameraActive ? (
                    <>
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-80 object-cover"
                      />
                      <canvas
                        ref={canvasRef}
                        className="absolute inset-0 w-full h-full pointer-events-none"
                      />
                      {isDetecting && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                          <div className="text-center text-white">
                            <div className="animate-pulse mb-4">
                              <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
                            </div>
                            <p className="text-lg font-semibold">Analyzing your gesture...</p>
                          </div>
                        </div>
                      )}
                    </>
                  ) : cameraLoading ? (
                    <div className="w-full h-80 flex items-center justify-center text-white">
                      <div className="text-center">
                        <div className="animate-pulse mb-4">
                          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
                        </div>
                        <p className="text-lg font-semibold">Starting camera...</p>
                        <p className="text-sm text-gray-300 mt-2">Please allow camera access if prompted</p>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-80 flex items-center justify-center text-gray-400">
                      <div className="text-center">
                        <CameraOff className="h-16 w-16 mx-auto mb-4" />
                        <p className="text-lg font-semibold">Camera not active</p>
                        <p className="text-sm text-gray-500 mt-2">Click "Start Camera" to begin practice</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  {/* Camera Controls */}
                  <div className="flex gap-2">
                    {!cameraActive && !cameraLoading ? (
                      <Button onClick={startCamera} className="flex-1">
                        <Camera className="h-4 w-4 mr-2" />
                        Start Camera
                      </Button>
                    ) : cameraLoading ? (
                      <Button disabled className="flex-1">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Starting Camera...
                      </Button>
                    ) : (
                      <Button onClick={stopCamera} variant="outline" className="flex-1">
                        <CameraOff className="h-4 w-4 mr-2" />
                        Stop Camera
                      </Button>
                    )}
                  </div>

                  {/* Detection Progress */}
                  {cameraActive && (
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm text-gray-600 mb-2">
                          <span>Detection Progress</span>
                          <span>{Math.round(detectionProgress)}%</span>
                        </div>
                        <Progress value={detectionProgress} className="h-3" />
                      </div>

                      <Button
                        onClick={startDetection}
                        disabled={isDetecting || isCompleted}
                        className="w-full"
                      >
                        {isDetecting ? 'Detecting...' : 'Start Detection'}
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Practice Tips */}
            <Card>
              <CardHeader>
                <CardTitle>Practice Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    Make sure you have good lighting
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    Position yourself clearly in the camera frame
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    Follow the instructions step by step
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    Hold the gesture for a few seconds
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}