'use client'

import { UserRole } from "@prisma/client"

interface DashboardHeaderProps {
  name: string
  role: UserRole
  email: string
}

export const DashboardHeader = ({ name}: DashboardHeaderProps) => {
  return (
    <div className="flex flex-col space-y-2 pb-6 pt-6">
      <h1 className="text-3xl font-bold">Welcome back, {name}!</h1>
    </div>
  )
} 