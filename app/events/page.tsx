"use client";
import { Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { useEffect, useState } from "react";
// import { format } from "date-fns";
import { eventService } from "./services";
import Loader from "@/components/Loader";
import EventCard from "@/components/eventCards/eventCard";
// import { Timestamp } from "firebase/firestore";

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      try {
        const response = await eventService.getEvents();
        setEvents(response);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvents();
  }, []);
  console.log(events);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen lg:p-40 p-20">
        <Loader />
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight">Events</h1>
        <p className="text-gray-400">
          Create and manage events on your platform.
        </p>
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
        <Link href="/events/create">
          <Button className="ml-autoe">
            <Plus className="mr-2 h-4 w-4" /> Create Event
          </Button>
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <EventCard key={event?.docId} event={event} />
        ))}
      </div>
    </div>
  );
}

