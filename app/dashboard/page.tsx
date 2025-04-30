import type { Metadata } from "next"
import { ArrowUpRight, Users, Calendar, Flag } from "lucide-react"
import Link from "next/link"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardChart } from "@/components/dashboard-chart"
import { UserActivityChart } from "@/components/user-activity-chart"

export const metadata: Metadata = {
  title: "Dashboard | Admin Panel",
  description: "Admin dashboard overview",
}

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-gray-400">Welcome back, Admin. Here's an overview of your platform.</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="border-gray-800 bg-gray-900">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Total Users</CardTitle>
            <Users className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">2,853</div>
            <p className="text-xs text-gray-400">
              <span className="text-green-500">+12%</span> from last month
            </p>
          </CardContent>
        </Card>
        <Card className="border-gray-800 bg-gray-900">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Upcoming Events</CardTitle>
            <Calendar className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">24</div>
            <p className="text-xs text-gray-400">
              <span className="text-green-500">+4</span> from last week
            </p>
          </CardContent>
        </Card>
        <Card className="border-gray-800 bg-gray-900">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Pending Reports</CardTitle>
            <Flag className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">7</div>
            <p className="text-xs text-gray-400">
              <span className="text-red-500">+3</span> from yesterday
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-gray-800 bg-gray-900">
          <CardHeader>
            <CardTitle>Event Activity</CardTitle>
            <CardDescription className="text-gray-400">Event registrations over the past 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <DashboardChart />
          </CardContent>
        </Card>
        <Card className="border-gray-800 bg-gray-900">
          <CardHeader>
            <CardTitle>User Signups</CardTitle>
            <CardDescription className="text-gray-400">New user registrations over time</CardDescription>
          </CardHeader>
          <CardContent>
            <UserActivityChart />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-gray-800 bg-gray-900">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Events</CardTitle>
              <CardDescription className="text-gray-400">Latest events created on the platform</CardDescription>
            </div>
            <Link href="/events" className="flex items-center gap-1 text-sm text-gray-400 hover:text-white">
              View all
              <ArrowUpRight className="h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  name: "Tech Conference 2025",
                  date: "May 15, 2025",
                  status: "Upcoming",
                },
                {
                  name: "Summer Music Festival",
                  date: "June 10, 2025",
                  status: "Upcoming",
                },
                {
                  name: "Design Workshop",
                  date: "April 28, 2025",
                  status: "Ongoing",
                },
                {
                  name: "Charity Gala",
                  date: "April 20, 2025",
                  status: "Past",
                },
              ].map((event) => (
                <div
                  key={event.name}
                  className="flex items-center justify-between rounded-md border border-gray-800 bg-gray-950 p-3"
                >
                  <div>
                    <div className="font-medium text-white">{event.name}</div>
                    <div className="text-xs text-gray-400">{event.date}</div>
                  </div>
                  <div
                    className={`rounded-full px-2 py-1 text-xs font-medium ${
                      event.status === "Upcoming"
                        ? "bg-blue-950 text-blue-400"
                        : event.status === "Ongoing"
                          ? "bg-green-950 text-green-400"
                          : "bg-gray-800 text-gray-400"
                    }`}
                  >
                    {event.status}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="border-gray-800 bg-gray-900">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Reports</CardTitle>
              <CardDescription className="text-gray-400">Latest reports submitted by users</CardDescription>
            </div>
            <Link href="/reports" className="flex items-center gap-1 text-sm text-gray-400 hover:text-white">
              View all
              <ArrowUpRight className="h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  user: "John Doe",
                  issue: "Inappropriate content in event description",
                  date: "2 hours ago",
                  status: "New",
                },
                {
                  user: "Jane Smith",
                  issue: "Technical issue with event registration",
                  date: "5 hours ago",
                  status: "In Progress",
                },
                {
                  user: "Mike Johnson",
                  issue: "Billing dispute for premium event",
                  date: "1 day ago",
                  status: "In Progress",
                },
                {
                  user: "Sarah Williams",
                  issue: "Spam accounts creating fake events",
                  date: "2 days ago",
                  status: "Resolved",
                },
              ].map((report) => (
                <div
                  key={report.user}
                  className="flex items-center justify-between rounded-md border border-gray-800 bg-gray-950 p-3"
                >
                  <div>
                    <div className="font-medium text-white">{report.user}</div>
                    <div className="text-xs text-gray-400">{report.issue}</div>
                    <div className="text-xs text-gray-500">{report.date}</div>
                  </div>
                  <div
                    className={`rounded-full px-2 py-1 text-xs font-medium ${
                      report.status === "New"
                        ? "bg-red-950 text-red-400"
                        : report.status === "In Progress"
                          ? "bg-yellow-950 text-yellow-400"
                          : "bg-green-950 text-green-400"
                    }`}
                  >
                    {report.status}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
