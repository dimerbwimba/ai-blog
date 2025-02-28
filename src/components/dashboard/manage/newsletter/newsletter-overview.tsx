"use client"

import { useEffect, useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Users,
  Mail,
  Download,
  Search,
  Filter,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { formatDate } from "@/lib/utils"
import { NewsletterStatus } from "@prisma/client"
import { saveAs } from 'file-saver'
import * as XLSX from 'xlsx'
import { toast } from "sonner"

interface NewsletterSubscriber {
  id: string
  email: string
  status: NewsletterStatus
  createdAt: string
}

interface NewsletterStats {
  total: number
  active: number
  unsubscribed: number
  bounced: number
  complained: number
}

interface PaginationInfo {
  total: number
  pages: number
  currentPage: number
  perPage: number
}

export function NewsletterOverview() {
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([])
  const [stats, setStats] = useState<NewsletterStats>({
    total: 0,
    active: 0,
    unsubscribed: 0,
    bounced: 0,
    complained: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("ALL")
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    pages: 0,
    currentPage: 1,
    perPage: 10
  })

  // Debounce search term to prevent too many API calls
  const debouncedSearchTerm = useDebounce(searchTerm, 500)

  useEffect(() => {
    fetchNewsletterData()
  }, [debouncedSearchTerm, statusFilter, page])

  const fetchNewsletterData = async () => {
    try {
      setIsLoading(true)
      
      const searchParams = new URLSearchParams({
        search: debouncedSearchTerm,
        status: statusFilter,
        page: page.toString(),
        limit: '10'
      })

      const [subscribersRes, statsRes] = await Promise.all([
        fetch(`/api/newsletter/subscribers?${searchParams}`),
        fetch("/api/newsletter/stats"),
      ])

      const [{ subscribers, pagination }, statsData] = await Promise.all([
        subscribersRes.json(),
        statsRes.json(),
      ])

      setSubscribers(subscribers)
      setPagination(pagination)
      setStats(statsData)
    } catch (error) {
      console.error("Error fetching newsletter data:", error)
      toast.error("Failed to fetch newsletter data")
    } finally {
      setIsLoading(false)
    }
  }

  const handleExportCSV = async () => {
    try {
      // Get all subscribers for export
      const response = await fetch("/api/newsletter/subscribers/export")
      const data = await response.json()

      if (!data.length) {
        toast.error("No subscribers to export")
        return
      }

      // Format data for export
      const exportData = data.map((subscriber: NewsletterSubscriber) => ({
        Email: subscriber.email,
        Status: subscriber.status,
        'Subscription Date': formatDate(subscriber.createdAt),
      }))

      // Create workbook and worksheet
      const wb = XLSX.utils.book_new()
      const ws = XLSX.utils.json_to_sheet(exportData)

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Subscribers')

      // Generate buffer
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
      const dataBlob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
      
      // Save file
      saveAs(dataBlob, `newsletter-subscribers-${formatDate(new Date())}.xlsx`)
      
      toast.success("Subscribers exported successfully!")
    } catch (error) {
      console.error('Export error:', error)
      toast.error("Failed to export subscribers")
    }
  }

  // Add pagination controls
  const handlePageChange = (newPage: number) => {
    setPage(newPage)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Newsletter Management</h2>
          <p className="text-muted-foreground">
            Manage your newsletter subscribers and view analytics
          </p>
        </div>
        <Button onClick={handleExportCSV} className="w-full md:w-auto">
          <Download className="mr-2 h-4 w-4" />
          Export Subscribers
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Subscribers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Subscribers</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active}</div>
          </CardContent>
        </Card>
      </div>

      {/* Subscribers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Subscribers</CardTitle>
          <CardDescription>
            A list of all your newsletter subscribers
          </CardDescription>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select
                value={statusFilter}
                onValueChange={setStatusFilter}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Status</SelectItem>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="UNSUBSCRIBED">Unsubscribed</SelectItem>
                  <SelectItem value="BOUNCED">Bounced</SelectItem>
                  <SelectItem value="COMPLAINED">Complained</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Subscribed Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : subscribers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center">
                      No subscribers found
                    </TableCell>
                  </TableRow>
                ) : (
                  subscribers.map((subscriber) => (
                    <TableRow key={subscriber.id}>
                      <TableCell className="font-medium">{subscriber.email}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                            subscriber.status === "ACTIVE"
                              ? "bg-green-100 text-green-700"
                              : subscriber.status === "UNSUBSCRIBED"
                              ? "bg-gray-100 text-gray-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {subscriber.status.toLowerCase()}
                        </span>
                      </TableCell>
                      <TableCell>{formatDate(subscriber.createdAt)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add pagination controls */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-center space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {pagination.pages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(page + 1)}
            disabled={page === pagination.pages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  )
}

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
} 