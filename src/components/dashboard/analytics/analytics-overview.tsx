"use client"

import { useState, useEffect } from "react"
import { Card, CardHeader} from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Overview } from "@/components/dashboard/analytics/overview"
import { TopPosts } from "@/components/dashboard/analytics/top-posts"
import { toast } from "sonner"

type Period = "7d" | "30d" | "all"

export function AnalyticsOverview() {
  const [period, setPeriod] = useState<Period>("30d")
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/analytics?period=${period}`)
        if (!response.ok) throw new Error("Failed to fetch analytics")
        const data = await response.json()
        setData(data)
      } catch (error) {
        console.error(error)
        toast.error("Failed to load analytics")
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [period])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
        <Tabs value={period} onValueChange={(value) => setPeriod(value as Period)}>
          <TabsList>
            <TabsTrigger value="7d">Last 7 days</TabsTrigger>
            <TabsTrigger value="30d">Last 30 days</TabsTrigger>
            <TabsTrigger value="all">All time</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="space-y-2">
                <div className="h-4 w-1/2 bg-muted rounded" />
                <div className="h-8 w-3/4 bg-muted rounded" />
              </CardHeader>
            </Card>
          ))}
        </div>
      ) : (
        <>
          <Overview data={data} />
        
          <TopPosts data={data?.topPosts} />
        </>
      )}
    </div>
  )
} 