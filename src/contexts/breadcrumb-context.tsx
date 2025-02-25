"use client"

import * as React from "react"
import { BreadcrumbItem } from "@/components/ui/breadcrumb"

export interface BreadcrumbItem {
  label: string
  href: string
}

interface BreadcrumbContextValue {
  items: BreadcrumbItem[]
  setItems: (items: BreadcrumbItem[]) => void
  addItem: (item: BreadcrumbItem) => void
  removeItem: (href: string) => void
  clearItems: () => void
}

const BreadcrumbContext = React.createContext<BreadcrumbContextValue | undefined>(
  undefined
)

export function BreadcrumbProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [items, setItems] = React.useState<BreadcrumbItem[]>([])

  const addItem = React.useCallback((item: BreadcrumbItem) => {
    setItems(prev => [...prev, item])
  }, [])

  const removeItem = React.useCallback((href: string) => {
    setItems(prev => prev.filter(item => item.href !== href))
  }, [])

  const clearItems = React.useCallback(() => {
    setItems([])
  }, [])

  const value = React.useMemo(
    () => ({
      items,
      setItems,
      addItem,
      removeItem,
      clearItems,
    }),
    [items, addItem, removeItem, clearItems]
  )

  return (
    <BreadcrumbContext.Provider value={value}>
      {children}
    </BreadcrumbContext.Provider>
  )
}

export function useBreadcrumbContext() {
  const context = React.useContext(BreadcrumbContext)
  if (context === undefined) {
    throw new Error("useBreadcrumbContext must be used within a BreadcrumbProvider")
  }
  return context
} 