"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  BarChart3, 
  Users, 
  FileText, 
  MapPin, 
  Settings, 
  Tag,
  ArrowRight,
  Hotel
} from "lucide-react"
import Link from "next/link"
import { Separator } from "@/components/ui/separator"

const managementCards = [
  {
    title: "Posts",
    description: "Manage all blog posts",
    icon: FileText,
    href: "/dashboard/manage/posts",
    color: "text-blue-500",
  },
  {
    title: "Categories",
    description: "Manage post categories",
    icon: Tag,
    href: "/dashboard/manage/categories",
    color: "text-green-500",
  },
  {
    title: "Destinations",
    description: "Manage travel destinations",
    icon: MapPin,
    href: "/dashboard/manage/destinations",
    color: "text-purple-500",
  },
  {
    title: "Accommodations",
    description: "Manage accommodations",
    icon: Hotel,
    href: "/dashboard/manage/accommodations",
    color: "text-orange-500",
  },
  {
    title: "Analytics",
    description: "Performance and metrics",
    icon: BarChart3,
    href: "/dashboard/manage/analytics",
    color: "text-orange-500",
  },
  {
    title: "Users",
    description: "Roles and permissions",
    icon: Users,
    href: "/dashboard/manage/users",
    color: "text-pink-500",
  },
  {
    title: "Settings",
    description: "Configure site settings",
    icon: Settings,
    href: "/dashboard/manage/settings",
    color: "text-gray-500",
  },
]

export function ManageOverview() {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
        {managementCards.map((card) => (
          <Link key={card.title} href={card.href}>
            <Card className="p-6 hover:shadow-md transition-shadow">
              <div className="space-y-3">
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-full bg-gray-100 ${card.color}`}>
                    <card.icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-lg">{card.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  {card.description}
                </p>
                <div className="flex items-center text-sm text-primary">
                  Manage
                  <ArrowRight className="ml-1 h-4 w-4" />
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      <Separator />

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Quick Actions</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="p-6">
            <div className="space-y-2">
              <h3 className="font-medium">Recent Activity</h3>
              <p className="text-sm text-muted-foreground">
                View the latest changes and updates
              </p>
              <Button variant="outline" className="w-full mt-4">
                View Activity
              </Button>
            </div>
          </Card>
          <Card className="p-6">
            <div className="space-y-2">
              <h3 className="font-medium">System Status</h3>
              <p className="text-sm text-muted-foreground">
                Check the current system status
              </p>
              <Button variant="outline" className="w-full mt-4">
                View Status
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
} 