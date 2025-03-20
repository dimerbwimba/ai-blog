import { create } from 'zustand'

interface ItineraryStore {
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
}

export const useItineraryStore = create<ItineraryStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
})) 