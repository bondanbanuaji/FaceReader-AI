import { create } from 'zustand'

interface AIResponse {
  expression: string
  career_prediction: string
  love_prediction: string
  general_tip: string
}

interface FaceAnalysisStore {
  isLoading: boolean
  result: AIResponse | null
  error: string | null
  imagePreview: string | null
  stream: MediaStream | null
  isAnalyzing: boolean
}

interface FaceAnalysisActions {
  setLoading: (loading: boolean) => void
  setResult: (result: AIResponse | null) => void
  setError: (error: string | null) => void
  setImagePreview: (image: string | null) => void
  setStream: (stream: MediaStream | null) => void
  setAnalyzing: (analyzing: boolean) => void
  reset: () => void
  analyzeFace: (imageBase64: string) => Promise<void>
}

type FaceAnalysisState = FaceAnalysisStore & FaceAnalysisActions

export const useFaceAnalysisStore = create<FaceAnalysisState>((set, get) => ({
  // Initial state
  isLoading: false,
  result: null,
  error: null,
  imagePreview: null,
  stream: null,
  isAnalyzing: false,

  // Actions
  setLoading: (loading) => set({ isLoading: loading }),
  setResult: (result) => set({ result }),
  setError: (error) => set({ error }),
  setImagePreview: (imagePreview) => set({ imagePreview }),
  setStream: (stream) => set({ stream }),
  setAnalyzing: (isAnalyzing) => set({ isAnalyzing }),

  reset: () => set({
    isLoading: false,
    result: null,
    error: null,
    imagePreview: null,
    isAnalyzing: false
  }),

  analyzeFace: async (imageBase64: string) => {
    const { setLoading, setResult, setError, setAnalyzing } = get()
    
    try {
      setLoading(true)
      setAnalyzing(true)
      setError(null)
      setResult(null)

      const response = await fetch('/api/analyze-face', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageBase64 })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Analysis failed')
      }

      const data = await response.json()
      
      if (data.error) {
        setError(data.error)
      } else {
        setResult(data)
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to analyze face')
    } finally {
      setLoading(false)
      setAnalyzing(false)
    }
  }
}))