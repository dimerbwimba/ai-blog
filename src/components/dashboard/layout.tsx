"use client"

import { Separator } from "../ui/separator"
import { useSession } from "next-auth/react"
import { BreadcrumbNav } from "./breadcrumb-nav"
import { EmailVerificationBanner } from "./email-verification-banner"

interface DashboardLayoutProps {
  header?: React.ReactNode
  children: React.ReactNode
  title: string
  illustration?: React.ReactNode
}

export const DashboardLayout = ({
  children,
  illustration,
  title
}: DashboardLayoutProps) => {
  const { data: session, status } = useSession()
  const showEmailVerification = status !== "loading" && !session?.user?.emailVerified

  return (
    <div className="h-full max-w-xl mx-auto px-4">
      <div className="flex flex-col gap-8">
        <div className="sticky bg-white top-11 md:top-12 z-50 rounded-lg px-4 border py-2 ">
            <BreadcrumbNav />
        </div>
        
        <EmailVerificationBanner show={showEmailVerification} />
        
        
        
        <div>
          <h2 className="text-xl font-bold text-richblack">
            {title}
          </h2>
          <Separator className="my-4" />
          {children}
          <div className="py-5"/>
          {illustration}
        </div>
      </div>
    </div>
  )
} 