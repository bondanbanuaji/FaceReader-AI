'use client'

import React, { useRef, useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Loader2, Camera, RotateCcw, AlertCircle } from 'lucide-react'
import { useFaceAnalysisStore } from '@/app/lib/store'

export function CameraCapture() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [isCameraReady, setIsCameraReady] = useState(false)
  
  const {
    stream,
    imagePreview,
    isAnalyzing,
    error,
    setStream,
    setImagePreview,
    setError,
    analyzeFace,
    reset
  } = useFaceAnalysisStore()

  // Start camera
  const startCamera = useCallback(async () => {
    try {
      setCameraError(null)
      setError(null)
      
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 640 },
          height: { ideal: 480 }
        }
      })

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }

      setStream(mediaStream)
      setIsCameraReady(true)
    } catch (error) {
      setCameraError(
        error instanceof Error 
          ? error.message 
          : 'Failed to access camera. Please ensure you have granted camera permissions.'
      )
      setIsCameraReady(false)
    }
  }, [setStream, setError])

  // Stop camera
  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
    }
    setIsCameraReady(false)
  }, [stream, setStream])

  // Capture photo
  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

    if (!context) return

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    // Draw video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    // Convert to Base64 JPEG
    const imageBase64 = canvas.toDataURL('image/jpeg', 0.8)
    
    // Extract the Base64 data (remove data:image/jpeg;base64, prefix)
    const base64Data = imageBase64.split(',')[1]

    setImagePreview(imageBase64)
    stopCamera()

    // Analyze the captured image
    analyzeFace(base64Data)
  }, [setImagePreview, stopCamera, analyzeFace])

  // Retake photo
  const retakePhoto = useCallback(() => {
    setImagePreview(null)
    setError(null)
    reset()
    startCamera()
  }, [setImagePreview, setError, reset, startCamera])

  // Initialize camera on mount
  useEffect(() => {
    startCamera()

    // Cleanup on unmount
    return () => {
      stopCamera()
    }
  }, []) // Only run on mount

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      {cameraError && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 text-red-700">
              <AlertCircle className="h-5 w-5" />
              <p className="text-sm">{cameraError}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 text-red-700">
              <AlertCircle className="h-5 w-5" />
              <p className="text-sm">{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-6">
          <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
            {!imagePreview ? (
              <>
                {/* Video preview */}
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                
                {/* Loading state */}
                {!isCameraReady && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                    <Loader2 className="h-8 w-8 animate-spin text-white" />
                  </div>
                )}

                {/* Camera overlay */}
                {isCameraReady && (
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute inset-0 border-2 border-white border-opacity-20 rounded-lg" />
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <div className="w-32 h-32 border-2 border-white border-opacity-40 rounded-full" />
                    </div>
                  </div>
                )}
              </>
            ) : (
              /* Captured image preview */
              <img
                src={imagePreview}
                alt="Captured face"
                className="w-full h-full object-cover"
              />
            )}

            {/* Analyzing overlay */}
            {isAnalyzing && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="text-center space-y-2">
                  <Loader2 className="h-8 w-8 animate-spin text-white mx-auto" />
                  <p className="text-white text-sm">Analyzing your face...</p>
                </div>
              </div>
            )}
          </div>

          {/* Hidden canvas for image processing */}
          <canvas ref={canvasRef} className="hidden" />

          {/* Controls */}
          <div className="flex justify-center space-x-4 mt-6">
            {!imagePreview ? (
              <Button
                onClick={capturePhoto}
                disabled={!isCameraReady || isAnalyzing}
                size="lg"
                className="min-w-[120px]"
              >
                {isAnalyzing ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Camera className="h-4 w-4 mr-2" />
                )}
                {isAnalyzing ? 'Analyzing...' : 'Capture'}
              </Button>
            ) : (
              <Button
                onClick={retakePhoto}
                disabled={isAnalyzing}
                variant="outline"
                size="lg"
                className="min-w-[120px]"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Retake
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}