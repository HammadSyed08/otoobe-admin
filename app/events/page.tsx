"use client";
import { Search, Plus } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Eye,
  Pencil,
  Trash2,
  MoreHorizontal,
  Calendar,
  Clock,
  MapPin,
  BadgeDollarSign,
  User,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { eventService } from "./services";
import Loader from "@/components/Loader";
import { Timestamp } from "firebase/firestore";

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
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
}

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";

function EventCard({ event }: { event: any }) {
  const router = useRouter();
  const [showDetails, setShowDetails] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // const formattedDate = event.eventDate?.start
  //   ? format(
  //       new Timestamp(event.eventDate.start, event.eventDate.start).toDate(),
  //       "PPP"
  //     )
  //   : "No Date";

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await eventService.deleteEvent(event.id, event.imageUrl);
      window.location.reload();
    } catch (error) {
      console.error("Error deleting event:", error);
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  return (
    <>
      <Card>
        <div className="relative h-48 w-full">
          <Image
            src={event.images?.[0] || "/placeholder.svg"}
            alt={event.title}
            fill
            className="object-cover rounded-t-lg"
            priority
          />
        </div>
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold truncate">{event.title}</h3>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-zinc-400 hover:text-white"
                >
                  <MoreHorizontal className="h-5 w-5" />
                  <span className="sr-only">Actions</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="bg-zinc-800 border border-zinc-700 text-zinc-100"
              >
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-zinc-700" />
                <DropdownMenuItem
                  className="gap-2 hover:bg-zinc-700"
                  onClick={() => setShowDetails(true)}
                >
                  <Eye className="h-4 w-4" /> View Details
                </DropdownMenuItem>
                {/* <DropdownMenuItem
                  className="gap-2 hover:bg-zinc-700"
                  onClick={() => router.push(`/events/edit/${event.id}`)}
                >
                  <Pencil className="h-4 w-4" /> Edit Event
                </DropdownMenuItem> */}
                <DropdownMenuItem
                  className="gap-2 hover:bg-zinc-700 text-red-500"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  <Trash2 className="h-4 w-4" /> Delete Event
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="space-y-2 text-sm text-zinc-400">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-zinc-500" />
              <span>
                {event.eventDate?.start.toDate().toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-zinc-500" />
              <span>
                {event.time?.startTime} - {event.time?.endTime}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-zinc-500" />
              <span>
                {event.location?.city}, {event.location?.country}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <BadgeDollarSign className="h-4 w-4 text-zinc-500" />
              <span>
                {event.price?.amount} {event.price?.currency}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-zinc-500" />
              <span>{event.createdBy}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{event.title}</DialogTitle>
            <DialogDescription className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm font-semibold">Description</p>
                <p className="text-sm text-gray-500">{event.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-semibold">Date</p>
                  <p className="text-sm text-gray-500">
                    {event.eventDate?.start.toDate().toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold">Time</p>
                  <p className="text-sm text-gray-500">
                    {event.time?.startTime} - {event.time?.endTime}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold">Location</p>
                  <p className="text-sm text-gray-500">
                    {event.location?.city}, {event.location?.country}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold">Price</p>
                  <p className="text-sm text-gray-500">
                    {event.price?.amount} {event.price?.currency}
                  </p>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              event and remove the data from the server.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
