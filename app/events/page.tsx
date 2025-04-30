import type { Metadata } from "next"
import { Search, Plus, MoreHorizontal, Pencil, Trash2, Eye } from "lucide-react"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export const metadata: Metadata = {
  title: "Events | Admin Panel",
  description: "Manage events",
}

const events = {
  upcoming: [
    {
      id: "1",
      name: "Tech Conference 2025",
      date: "May 15, 2025",
      location: "San Francisco, CA",
      image: "/placeholder.svg?height=200&width=400",
      attendees: 450,
    },
    {
      id: "2",
      name: "Summer Music Festival",
      date: "June 10, 2025",
      location: "Austin, TX",
      image: "/placeholder.svg?height=200&width=400",
      attendees: 1200,
    },
    {
      id: "3",
      name: "Startup Pitch Competition",
      date: "July 5, 2025",
      location: "New York, NY",
      image: "/placeholder.svg?height=200&width=400",
      attendees: 300,
    },
  ],
  ongoing: [
    {
      id: "4",
      name: "Design Workshop",
      date: "April 28, 2025",
      location: "Chicago, IL",
      image: "/placeholder.svg?height=200&width=400",
      attendees: 75,
    },
    {
      id: "5",
      name: "Virtual Career Fair",
      date: "April 29, 2025",
      location: "Online",
      image: "/placeholder.svg?height=200&width=400",
      attendees: 620,
    },
  ],
  past: [
    {
      id: "6",
      name: "Charity Gala",
      date: "April 20, 2025",
      location: "Los Angeles, CA",
      image: "/placeholder.svg?height=200&width=400",
      attendees: 350,
    },
    {
      id: "7",
      name: "Product Launch",
      date: "April 15, 2025",
      location: "Seattle, WA",
      image: "/placeholder.svg?height=200&width=400",
      attendees: 280,
    },
    {
      id: "8",
      name: "Annual Conference",
      date: "March 25, 2025",
      location: "Miami, FL",
      image: "/placeholder.svg?height=200&width=400",
      attendees: 900,
    },
  ],
}

export default function EventsPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight">Events</h1>
        <p className="text-gray-400">Create and manage events on your platform.</p>
      </div>

      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Search events..."
            className="w-full border-gray-800 bg-gray-900 pl-8 text-white placeholder:text-gray-500"
          />
        </div>
        <Button className="ml-auto bg-gray-100 text-black hover:bg-white">
          <Plus className="mr-2 h-4 w-4" /> Create Event
        </Button>
      </div>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-gray-900">
          <TabsTrigger value="upcoming" className="data-[state=active]:bg-gray-800">
            Upcoming
          </TabsTrigger>
          <TabsTrigger value="ongoing" className="data-[state=active]:bg-gray-800">
            Ongoing
          </TabsTrigger>
          <TabsTrigger value="past" className="data-[state=active]:bg-gray-800">
            Past
          </TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming" className="mt-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.upcoming.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="ongoing" className="mt-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.ongoing.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="past" className="mt-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.past.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function EventCard({ event }: { event: any }) {
  return (
    <Card className="overflow-hidden border-gray-800 bg-gray-900">
      <div className="relative h-48 w-full">
        <Image src={event.image || "/placeholder.svg"} alt={event.name} fill className="object-cover" priority />
      </div>
      <CardContent className="p-4">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="font-semibold text-white">{event.name}</h3>
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
                <Eye className="h-4 w-4" /> View Details
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2 hover:bg-gray-800">
                <Pencil className="h-4 w-4" /> Edit Event
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2 hover:bg-gray-800">
                <Trash2 className="h-4 w-4" /> Delete Event
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="space-y-1 text-sm text-gray-400">
          <div>{event.date}</div>
          <div>{event.location}</div>
          <div>{event.attendees} attendees</div>
        </div>
      </CardContent>
    </Card>
  )
}
