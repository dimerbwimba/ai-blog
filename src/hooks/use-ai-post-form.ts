import { useState, useEffect } from 'react'

interface AIPostFormData {
  title: string
  slug: string
  outline: OutlineSection[]
  content: string
  conclusion: string
  faqs: Array<{ question: string; answer: string }>
  currentStep: number
  topic?: string
  suggestedTitles?: string[]
  selectedTitle?: string
  description: string
  suggestedDescriptions?: string[]
  selectedDescription?: string
  seoSlug: string
  tags: string[]
  keywords: string[]
  suggestedTags?: string[]
  suggestedKeywords?: string[]
  suggestedOutline?: string[]
  sections?: Array<{
    h2: string
    content: string
  }>
}

export interface OutlineSection {
  h2: string
  h3: string[]
  content?: string
}

const STORAGE_KEY = 'ai_post_form_data'

export function useAIPostForm(initialData?: Partial<AIPostFormData>) {
  const [formData, setFormData] = useState<AIPostFormData>(() => {
    if (typeof window === 'undefined') return getInitialState(initialData)
    
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : getInitialState(initialData)
    } catch (error) {
      console.error('Failed to parse stored form data:', error)
      return getInitialState(initialData)
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData))
  }, [formData])

  const updateFormData = (updates: Partial<AIPostFormData>) => {
    setFormData(prev => ({
      ...prev,
      ...updates
    }))
  }

  const clearFormData = () => {
    localStorage.removeItem(STORAGE_KEY)
    setFormData(getInitialState())
  }

  return {
    formData,
    updateFormData,
    clearFormData
  }
}

function getInitialState(initialData?: Partial<AIPostFormData>): AIPostFormData {
  return {
    title: '',
    slug: '',
    outline: [],
    content: '',
    conclusion: '',
    faqs: [],
    currentStep: 1,
    topic: '',
    suggestedTitles: [],
    selectedTitle: '',
    description: '',
    suggestedDescriptions: [],
    selectedDescription: '',
    seoSlug: '',
    tags: [],
    keywords: [],
    suggestedTags: [],
    suggestedKeywords: [],
    suggestedOutline: [],
    sections: [],
    ...initialData
  }
} 