'use client'

import React from 'react'
import { motion, Variants } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Sparkles, Heart, Briefcase, Lightbulb, RotateCcw } from 'lucide-react'
import { useFaceAnalysisStore } from '@/app/lib/store'

interface ResultItemProps {
  icon: React.ReactNode
  title: string
  content: string
  delay: number
}

const ResultItem: React.FC<ResultItemProps> = ({ icon, title, content, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <Card className="h-full">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-lg">
            {icon}
            <span>{title}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 leading-relaxed">{content}</p>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export function ResultsDisplay() {
  const result = useFaceAnalysisStore((state) => state.result)
  const reset = useFaceAnalysisStore((state) => state.reset)

  const handleNewAnalysis = () => {
    reset()
  }

  if (!result) return null

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full max-w-4xl mx-auto space-y-6"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-2"
      >
        <div className="flex items-center justify-center space-x-2">
          <Sparkles className="h-6 w-6 text-yellow-500" />
          <h2 className="text-2xl font-bold text-gray-900">Your Face Reading</h2>
          <Sparkles className="h-6 w-6 text-yellow-500" />
        </div>
        <Badge variant="secondary" className="text-sm">
          AI-Powered Analysis
        </Badge>
      </motion.div>

      {/* Expression */}
      <ResultItem
        icon={<Sparkles className="h-5 w-5 text-purple-500" />}
        title="Expression Analysis"
        content={result.expression}
        delay={0.2}
      />

      {/* Career Prediction */}
      <ResultItem
        icon={<Briefcase className="h-5 w-5 text-blue-500" />}
        title="Career Insights"
        content={result.career_prediction}
        delay={0.3}
      />

      {/* Love Prediction */}
      <ResultItem
        icon={<Heart className="h-5 w-5 text-red-500" />}
        title="Love & Relationships"
        content={result.love_prediction}
        delay={0.4}
      />

      {/* General Tip */}
      <ResultItem
        icon={<Lightbulb className="h-5 w-5 text-yellow-500" />}
        title="General Guidance"
        content={result.general_tip}
        delay={0.5}
      />

      {/* Action Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="text-center space-y-4"
      >
        <Button 
          onClick={handleNewAnalysis}
          variant="outline"
          size="lg"
          className="min-w-[160px]"
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          New Analysis
        </Button>
        
        <p className="text-sm text-gray-500">
          This analysis is for entertainment purposes and personal reflection.
        </p>
      </motion.div>
    </motion.div>
  )
}