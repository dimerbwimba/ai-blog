'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    ChevronsLeft,
    LogOut,
    Menu,
    Settings,
} from "lucide-react"
import { signOut, useSession } from "next-auth/react"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"


export const DashboardNavbar = () => {
    const session = useSession()

    return (
        <nav className="fixed top-0 z-50 w-full border-b backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-10 items-center">
                {/* Logo/Brand */}
                <div className="mr-4 hidden md:flex">
                    <Link href="/" className="mr-6 flex items-center space-x-2">
                        <ChevronsLeft className="h-4 w-4" />
                        <span className="hidden font-bold sm:inline-block">
                            Travelkaya
                        </span>
                    </Link>
                    <Separator orientation="vertical" className="h-6" />
                </div>

                {/* Desktop Navigation */}
                <div className="hidden md:flex md:items-center md:gap-2 flex-1">
                    {session.status === "loading" ? (
                        <div className="flex items-center gap-2 animate-pulse">
                            <div className="h-6 w-6 rounded-full bg-gray-200" />
                            <div className="h-4 w-32 bg-gray-200 rounded" />
                        </div>
                    ) : (
                        <>
                            <div className="flex items-center gap-2">
                                <Avatar className="h-6 w-6">
                                    <AvatarImage src={session?.data?.user?.image} />
                                    <AvatarFallback>
                                        {session?.data?.user?.name?.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                            </div>
                            <span className="text-sm font-medium">
                                {`Hello , `}
                                <span className="font-bold">
                                    {session?.data?.user?.name}
                                </span>
                            </span>
                        </>
                    )}
                </div>

                {/* Mobile Menu */}
                <div className="flex md:hidden">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">Toggle menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left">
                            <SheetHeader>
                                <SheetTitle>Dashboard Menu</SheetTitle>
                                <SheetDescription>
                                    Navigate through dashboard sections
                                </SheetDescription>
                            </SheetHeader>
                            <nav className="flex flex-col gap-4 mt-4">
                                links
                            </nav>
                        </SheetContent>
                    </Sheet>
                </div>

                {
                    session.status === "loading" ? (
                        <div className="flex items-center gap-2 px-3">
                            <div className="h-4 w-32 bg-gray-200 rounded" />
                        </div>
                    ) : (
                        <>
                            <div className="flex items-center gap-2 px-3">
                                <Link className="flex items-center gap-2 hover:text-primary" href="/dashboard/settings">
                                    <Settings className="h-4 w-4" />
                                    <span className=" text-sm">Settings</span>
                                </Link>
                            </div>
                            {/* Sign Out Button */}
                            <div className="ml-auto">
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={() => signOut()}
                                    className="text-muted-foreground hover:text-primary"
                                >
                                    <LogOut className="h-4 w-4" />
                                    <span className="text-sm px-2">Sign out</span>
                                </Button>
                            </div>
                        </>
                    )
                }
            </div>
        </nav>
    )
} 