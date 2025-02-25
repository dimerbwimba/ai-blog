'use client'

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { useSession } from "next-auth/react"
import { useAuthModal } from '@/store/use-auth-modal'
import Link from "next/link"

const Navbar = () => {
  const { data: session } = useSession()
  const authModal = useAuthModal()

  const isAuthorized = session?.user.role === "WRITER" || session?.user.role === "ADMIN"

  return (
    <nav className="fixed top-0 z-50 w-full border-b bg-white">
      <div className="container flex h-10 items-center">
        {/* Logo/Brand */}
        <div className="mr-4 hidden md:flex">
          <a href="/" className="mr-6 flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              TravelKaya
            </span>
          </a>
          <Separator orientation="vertical" className="h-6" />
        </div>
        {/* Desktop Navigation */}
        <div className="hidden uppercase  md:flex md:items-center md:gap-6 flex-1 justify-center">
          <Link
            href="/destinations"
            className="text-sm font-black px-4 py-1 rounded-md transition-all hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 hover:text-white"
          >
            Destinations
          </Link>
          <Link
            href="/travel-guides"
            className="text-sm font-bold transition-colors hover:text-blue-600"
          >
            Travel Guides
          </Link>
          <Link
            href="/getting-started"
            className="text-sm font-bold transition-colors hover:text-blue-600"
          >
            Getting Started
          </Link>
          <Link
            href="/about"
            className="text-sm font-bold transition-colors hover:text-blue-600"
          >
            About
          </Link>
        </div>
        {/* Mobile Menu */}
        <div className="flex items-center justify-between space-x-2 md:justify-end">
          <div className="flex md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden hover:text-blue-600">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                    Travel Menu
                  </SheetTitle>
                  <SheetDescription>
                    Explore our travel content
                  </SheetDescription>
                </SheetHeader>
                <nav className="flex flex-col gap-4 mt-4">
                  <Link
                    href="/destinations"
                    className="text-sm font-medium transition-colors hover:text-blue-600"
                  >
                    Destinations
                  </Link>
                  <Link
                    href="/travel-guides"
                    className="text-sm font-medium transition-colors hover:text-blue-600"
                  >
                    Travel Guides
                  </Link>
                  <Link
                    href="/getting-started"
                    className="text-sm font-medium transition-colors hover:text-blue-600"
                  >
                    Start here
                  </Link>
                  <Link
                    href="/about"
                    className="text-sm font-medium transition-colors hover:text-blue-600"
                  >
                    About
                  </Link>
                  {isAuthorized && (
                    <Link
                      href="/dashboard"
                      className="text-sm font-medium transition-colors hover:text-blue-600"
                    >
                      Dashboard
                    </Link>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex md:items-center md:gap-2">
            {session ? (
              <>
                {isAuthorized && (
                  <>
                    <Link href="/dashboard">
                      <Button 
                        size="sm"
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0"
                      >
                        Share Story
                      </Button>
                    </Link>
                  </>
                )}
              </>
            ) : (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={authModal.onOpen}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar