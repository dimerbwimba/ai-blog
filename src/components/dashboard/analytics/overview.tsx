"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, Users, TrendingUp, BarChart } from "lucide-react"

interface OverviewProps {
  data: {
    totalViews: number
    uniqueVisitors: number
  }
}

export function Overview({ data }: OverviewProps) {
  const stats = [
    {
      title: "Total Views",
      value: data?.totalViews ?? 0,
      icon: Eye,
      description: "Total page views"
    },
    {
      title: "Unique Visitors",
      value: data?.uniqueVisitors ?? 0,
      icon: Users,
      description: "Unique visitors"
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {stat.title}
            </CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
} 