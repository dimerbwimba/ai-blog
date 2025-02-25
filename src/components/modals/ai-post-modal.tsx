"use client"

import { useCallback, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useAiPostModal } from '@/store/use-ai-post-modal'
import { AIPostForm } from '../dashboard/ai-post/ai-post-form'
const  AiPost= () => {
 const { isOpen, onClose } = useAiPostModal()
  const [isLoading, setIsLoading] = useState(false)

  const handleClose = useCallback(() => {
    onClose()
  }, [onClose])

    return ( 

        <Dialog 
        open={isOpen} 
        onOpenChange={handleClose}
      >
        <DialogContent className="max-w-[1000px] w-11/12 h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Post with AI</DialogTitle>
          </DialogHeader>
          <AIPostForm onSuccess={() => handleClose()} />
        </DialogContent>
      </Dialog>
     );
}
 
export default AiPost;