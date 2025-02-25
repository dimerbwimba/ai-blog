import { create } from 'zustand'

interface AiPostModalStore {
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
}

export const useAiPostModal = create<AiPostModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
})) 