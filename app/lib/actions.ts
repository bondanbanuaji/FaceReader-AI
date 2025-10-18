'use server'

import { createClient } from '@/lib/supabase/server'
import { db } from '@/db'
import { readings } from '@/db/schema'
import { eq } from 'drizzle-orm'

interface AIResponse {
  expression: string
  career_prediction: string
  love_prediction: string
  general_tip: string
}

export async function analyzeFace(imageBase64: string): Promise<AIResponse | { error: string }> {
  try {
    // Validate input
    if (!imageBase64 || typeof imageBase64 !== 'string') {
      return { error: 'Invalid image data' }
    }

    // Check API key
    const apiKey = process.env.GOOGLE_API_KEY
    if (!apiKey) {
      return { error: 'API key not configured' }
    }

    // Get authenticated user
    const supabase = createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return { error: 'Authentication required' }
    }

    // Prepare request for Google Gemini API
    const prompt = `Analyze this image of a person's face. Based on their expression and features, provide a short, positive, and inspiring "reading". Respond ONLY with a valid JSON object with the following structure: { "expression": "string", "career_prediction": "string", "love_prediction": "string", "general_tip": "string" }. Do not wrap the JSON in markdown backticks.`

    const requestBody = {
      contents: [
        {
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType: "image/jpeg",
                data: imageBase64
              }
            }
          ]
        }
      ]
    }

    // Call Google Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Gemini API Error:', errorText)
      return { error: `AI analysis failed: ${response.status}` }
    }

    const responseData = await response.json()
    
    // Extract AI response
    const candidate = responseData.candidates?.[0]
    const content = candidate?.content?.parts?.[0]?.text
    
    if (!content) {
      return { error: 'No response from AI model' }
    }

    // Parse JSON response
    let aiResult: AIResponse
    try {
      // Clean up the response in case it contains markdown
      const cleanedContent = content.replace(/```json\n?|\n?```/g, '').trim()
      aiResult = JSON.parse(cleanedContent)
      
      // Validate required fields
      if (!aiResult.expression || !aiResult.career_prediction || !aiResult.love_prediction || !aiResult.general_tip) {
        return { error: 'Invalid AI response format' }
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError, 'Content:', content)
      return { error: 'Failed to parse AI response' }
    }

    // Save to database
    try {
      await db.insert(readings).values({
        userId: user.id,
        aiResult: aiResult,
        createdAt: new Date()
      })
    } catch (dbError) {
      console.error('Database error:', dbError)
      // Continue even if database save fails
    }

    return aiResult

  } catch (error) {
    console.error('Server action error:', error)
    return { error: 'Internal server error' }
  }
}

export async function getUserReadings() {
  try {
    const supabase = createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return { error: 'Authentication required' }
    }

    const userReadings = await db
      .select()
      .from(readings)
      .where(eq(readings.userId, user.id))
      .orderBy(readings.createdAt)

    return { readings: userReadings }
  } catch (error) {
    console.error('Failed to get user readings:', error)
    return { error: 'Failed to fetch readings' }
  }
}