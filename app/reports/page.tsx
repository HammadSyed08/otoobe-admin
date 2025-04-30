import type { Metadata } from "next"
import { Search, MoreHorizontal, MessageSquare, CheckCircle, Trash2 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export const metadata: Metadata = {
  title: "Reports | Admin Panel",
  description: "Manage user reports",
}

const reports = [
  {
    id: "1",
    user: {
      name: "John Doe",
      email: "john@example.com",
      avatar: "/placeholder-user.jpg",
    },
    issue: "Inappropriate content in event description",
    date: "2 hours ago",
    status: "New",
  },
  {
    id: "2",
    user: {
      name: "Jane Smith",
      email: "jane@example.com",
      avatar: "/placeholder-user.jpg",
    },
    issue: "Technical issue with event registration",
    date: "5 hours ago",
    status: "In Progress",
  },
  {
    id: "3",
    user: {
      name: "Mike Johnson",
      email: "mike@example.com",
      avatar: "/placeholder-user.jpg",
    },
    issue: "Billing dispute for premium event",
    date: "1 day ago",
    status: "In Progress",
  },
  {
    id: "4",
    user: {
      name: "Sarah Williams",
      email: "sarah@example.com",
      avatar: "/placeholder-user.jpg",
    },
    issue: "Spam accounts creating fake events",
    date: "2 days ago",
    status: "Resolved",
  },
  {
    id: "5",
    user: {
      name: "David Brown",
      email: "david@example.com",
      avatar: "/placeholder-user.jpg",
    },
    issue: "Harassment from another user in event chat",
    date: "3 days ago",
    status: "New",
  },
  {
    id: "6",
    user: {
      name: "Emily Davis",
      email: "emily@example.com",
      avatar: "/placeholder-user.jpg",
    },
    issue: "Event location is incorrect",
    date: "4 days ago",
    status: "Resolved",
  },
  {
    id: "7",
    user: {
      name: "Robert Wilson",
      email: "robert@example.com",
      avatar: "/placeholder-user.jpg",
    },
    issue: "Payment not processed for ticket purchase",
    date: "5 days ago",
    status: "In Progress",
  },
]

export default function ReportsPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
        <p className="text-gray-400">Manage and respond to user-submitted reports.</p>
      </div>

      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Search reports..."
            className="w-full border-gray-800 bg-gray-900 pl-8 text-white placeholder:text-gray-500"
          />
        </div>
      </div>

      <div className="rounded-md border border-gray-800">
        <Table>
          <TableHeader className="bg-gray-900">
            <TableRow className="border-gray-800 hover:bg-gray-900/80">
              <TableHead className="text-gray-400">User</TableHead>
              <TableHead className="text-gray-400">Issue</TableHead>
              <TableHead className="text-gray-400">Date</TableHead>
              <TableHead className="text-gray-400">Status</TableHead>
              <TableHead className="text-right text-gray-400">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports.map((report) => (
              <TableRow key={report.id} className="border-gray-800 hover:bg-gray-900/50">
                <TableCell className="flex items-center gap-3 font-medium text-white">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={report.user.avatar || "/placeholder.svg"} alt={report.user.name} />
                    <AvatarFallback className="bg-gray-800">
                      {report.user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div>{report.user.name}</div>
                    <div className="text-xs text-gray-400">{report.user.email}</div>
                  </div>
                </TableCell>
                <TableCell className="text-gray-400">{report.issue}</TableCell>
                <TableCell className="text-gray-400">{report.date}</TableCell>
                <TableCell>
                  <div
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      report.status === "New"
                        ? "bg-red-950 text-red-400"
                        : report.status === "In Progress"
                          ? "bg-yellow-950 text-yellow-400"
                          : "bg-green-950 text-green-400"
                    }`}
                  >
                    {report.status}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-gray-900 text-white">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-gray-800" />
                      <DropdownMenuItem className="flex items-center gap-2 hover:bg-gray-800">
                        <MessageSquare className="h-4 w-4" /> Reply
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex items-center gap-2 hover:bg-gray-800">
                        <CheckCircle className="h-4 w-4" /> Mark as Resolved
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex items-center gap-2 hover:bg-gray-800">
                        <Trash2 className="h-4 w-4" /> Delete Report
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
