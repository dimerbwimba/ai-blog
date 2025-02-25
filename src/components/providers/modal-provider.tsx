'use client'

import { useEffect, useState } from 'react'
import AuthModal from '@/components/modals/auth-modal'
import AiPost from '../modals/ai-post-modal'

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <>
      <AiPost/>
      <AuthModal />
    </>
  )
} 