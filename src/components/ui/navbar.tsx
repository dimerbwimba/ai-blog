"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Menu,
  MapPin,
  BookOpen,
  Compass,
  Info,
  Share,
  LogIn,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useSession } from "next-auth/react";
import { useAuthModal } from "@/store/use-auth-modal";
import Link from "next/link";
import { LatestPosts } from "../shared/latest-posts";
import { ScrollArea } from "./scroll-area";

const Navbar = () => {
  const { data: session } = useSession();
  const authModal = useAuthModal();

  const isAuthorized =
    session?.user.role === "WRITER" || session?.user.role === "ADMIN";

  return (
    <nav className="fixed top-0 z-50 w-full border-b bg-white">
      <div className="container flex h-10 items-center">
        {/* Logo/Brand */}
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              ✈️ EPIC-DESTINATIONS
            </span>
          </Link>
          <Separator orientation="vertical" className="h-6" />
        </div>
        {/* Desktop Navigation */}
        <div className="hidden uppercase  md:flex md:items-center md:gap-6 flex-1 justify-center">
          <Link
            href="/destinations"
            className="text-sm font-black px-4 py-1 rounded-md transition-all hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 hover:text-white flex items-center gap-2"
          >
            <MapPin className="h-4 w-4" />
            Destinations
          </Link>
          <Link
            href="/travel-guides"
            className="text-sm font-bold transition-colors hover:text-blue-600 flex items-center gap-2"
          >
            <BookOpen className="h-4 w-4" />
            Travel Guides
          </Link>
          <Link
            href="/getting-started"
            className="text-sm font-bold transition-colors hover:text-blue-600 flex items-center gap-2"
          >
            <Compass className="h-4 w-4" />
            Getting Started
          </Link>
          <Link
            href="/about"
            className="text-sm font-bold transition-colors hover:text-blue-600 flex items-center gap-2"
          >
            <Info className="h-4 w-4" />
            About
          </Link>
        </div>
        {/* Mobile Menu */}
        <div className="flex items-center justify-between space-x-2 md:justify-end">
          <div className="flex md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden hover:text-blue-600"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="">
                <SheetHeader>
                  <SheetTitle className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                    🌎 Travel Menu
                  </SheetTitle>
                  <SheetDescription>
                    Explore our travel content
                  </SheetDescription>
                </SheetHeader>
                <ScrollArea className=" h-screen">
                  <div className="space-y-4 pr-4">
                    <nav className="flex flex-col gap-2 mt-4">
                      {[
                        {
                          title: "Destinations",
                          description:
                            "Explore amazing places and hidden gems around the world",
                          icon: <MapPin className="h-4 w-4" />,
                          href: "/destinations",
                        },
                        {
                          title: "Travel Guides",
                          description:
                            "Discover travel guides and tips for your next adventure",
                          icon: <BookOpen className="h-4 w-4" />,
                          href: "/travel-guides",
                        },
                        {
                          title: "Getting Started",
                          description:
                            "Get started with travel planning and tips",
                          icon: <Compass className="h-4 w-4" />,
                          href: "/getting-started",
                        },
                        {
                          title: "About",
                          description:
                            "Learn more about our travel blog and mission",
                          icon: <Info className="h-4 w-4" />,
                          href: "/about",
                        },
                      ].map((item, i) => (
                        <div
                          key={i}
                          className="border-b py-2 hover:bg-gray-100"
                        >
                          <Link
                            href={item.href}
                            className="text-sm font-medium transition-colors hover:text-blue-600 flex items-center gap-2"
                          >
                            {item.icon}
                            <span className="text-lg font-medium">
                              {item.title}
                            </span>
                          </Link>
                          <p className="text-xs text-muted-foreground pl-6 m-0">
                            {item.description}
                          </p>
                        </div>
                      ))}

                      <LatestPosts />
                      {isAuthorized && (
                        <div className="space-y-2">
                          <Link
                            href="/dashboard"
                            className="text-sm font-medium transition-colors hover:text-blue-600 flex items-center gap-2"
                          >
                            <Share className="h-4 w-4" />
                            <span className="text-lg font-medium">
                              Dashboard
                            </span>
                          </Link>
                          <p className="text-xs text-muted-foreground pl-6 m-0">
                            Manage your content and share your stories
                          </p>
                        </div>
                      )}
                    </nav>
                  </div>
                </ScrollArea>
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
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 flex items-center gap-2"
                      >
                        <Share className="h-4 w-4" />
                        <span className="text-lg font-medium">Share Story</span>
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
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white flex items-center gap-2"
              >
                <LogIn className="h-4 w-4" />
                <span className="text-lg font-medium">Sign In</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
