import { Suspense } from "react";
import { Metadata } from "next";
import { DestinationsGrid } from "@/components/destinations/destinations-grid";
import { DestinationsSearch } from "@/components/destinations/destinations-search";
import { DestinationsFilter } from "@/components/destinations/destinations-filter";
import { DestinationsGridSkeleton } from "@/components/destinations/destinations-grid-skeleton";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Travel Destinations | Explore Amazing Places Around the World",
  description:
    "Discover amazing travel destinations worldwide. Find detailed guides, local insights, and travel tips for your next adventure.",
  keywords:
    "travel destinations, world travel, travel guides, international destinations, travel planning, vacation spots, tourist attractions, travel inspiration, global destinations, travel bucket list",
  openGraph: {
    title: "Travel Destinations | Explore Amazing Places Around the World",
    description:
      "Discover amazing travel destinations worldwide. Find detailed guides, local insights, and travel tips for your next adventure.",
    type: "website",
    url: process.env.DOMAIN_URL,
    siteName: "Travel Blog",
    locale: "en_US",
    images: [
      {
        url: "/images/destinations-og.jpg",
        width: 1200,
        height: 630,
        alt: "Travel Destinations",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Travel Destinations | Explore Amazing Places Around the World",
    description:
      "Discover amazing travel destinations worldwide. Find detailed guides, local insights, and travel tips for your next adventure.",
    site: "@yourtwitterhandle",
    creator: "@yourtwitterhandle",
    images: ["/images/destinations-og.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: process.env.DOMAIN_URL + "/destinations",
  },
  authors: [{ name: "Travel Kaya", url: process.env.DOMAIN_URL + "/about" }],
  category: "Travel",
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
    yahoo: "your-yahoo-verification-code",
  },
};

export default async function DestinationsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const {
    page = "1",
    search,
    continent,
    country,
    sortBy = "posts",
    order = "desc",
  } = await searchParams;

  return (
    <div className="container max-w-xl py-20">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Explore Amazing Destinations
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Discover incredible places around the world, from pristine beaches to
          historic cities. Find travel inspiration and plan your next adventure.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <DestinationsSearch />
          <DestinationsFilter />
        </div>
      </div>
      <div className="relative h-[40px] w-full mb-10">
        <Image
          src={"/blog_divider_735x40_.webp"}
          alt={"divider"}
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Destinations Grid with Loading State */}
      <Suspense fallback={<DestinationsGridSkeleton />}>
        <DestinationsGrid
          page={page}
          search={search}
          continent={continent}
          country={country}
          sortBy={sortBy as "name" | "posts" | "country"}
          order={order as "asc" | "desc"}
        />
      </Suspense>
    </div>
  );
}
