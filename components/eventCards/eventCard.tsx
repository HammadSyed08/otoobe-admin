'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  MoreHorizontal,
  Eye,
  Trash2,
  Calendar,
  Clock,
  MapPin,
  BadgeDollarSign,
  User,
} from 'lucide-react';
import { eventService } from '@/app/events/services';

function EventCard({ event }: { event: any }) {
  const [showDetails, setShowDetails] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // ✅ Auto-hide past events
  const now = new Date();
  const eventEnd =
    event?.eventDate?.end?.toDate?.() || event?.eventDate?.start?.toDate?.();

  if (eventEnd && eventEnd < now) {
    // Don't render the card if the event is already over
    return null;
  }

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await eventService.deleteEvent(event.id, event.imageUrl);
      window.location.reload();
    } catch (error) {
      console.error('Error deleting event:', error);
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  return (
    <>
      <Card>
        <div className='relative h-48 w-full'>
          <Image
            src={event.images?.[0] || '/placeholder.svg'}
            alt={event.title}
            fill
            className='object-cover rounded-t-lg'
            priority
          />
        </div>
        <CardContent className='p-4 space-y-3'>
          <div className='flex items-center justify-between'>
            <h3 className='text-lg font-semibold truncate'>{event.title}</h3>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant='ghost'
                  size='icon'
                  className='text-zinc-400 hover:text-white'
                >
                  <MoreHorizontal className='h-5 w-5' />
                  <span className='sr-only'>Actions</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align='end'
                className='bg-zinc-800 border border-zinc-700 text-zinc-100'
              >
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator className='bg-zinc-700' />
                <DropdownMenuItem
                  className='gap-2 hover:bg-zinc-700'
                  onClick={() => setShowDetails(true)}
                >
                  <Eye className='h-4 w-4' /> View Details
                </DropdownMenuItem>
                <DropdownMenuItem
                  className='gap-2 hover:bg-zinc-700 text-red-500'
                  onClick={() => setShowDeleteDialog(true)}
                >
                  <Trash2 className='h-4 w-4' /> Delete Event
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className='space-y-2 text-sm text-zinc-400'>
            <div className='flex items-center gap-2'>
              <Calendar className='h-4 w-4 text-zinc-500' />
              <span>
                {event.eventDate?.start?.toDate
                  ? event.eventDate.start.toDate().toLocaleDateString()
                  : 'No Date'}
              </span>
            </div>
            <div className='flex items-center gap-2'>
              <Clock className='h-4 w-4 text-zinc-500' />
              <span>
                {event.time?.startTime} - {event.time?.endTime}
              </span>
            </div>
            <div className='flex items-center gap-2'>
              <MapPin className='h-4 w-4 text-zinc-500' />
              <span>
                {event.location?.city}, {event.location?.country}
              </span>
            </div>
            <div className='flex items-center gap-2'>
              <BadgeDollarSign className='h-4 w-4 text-zinc-500' />
              <span>
                {event.price?.amount} {event.price?.currency}
              </span>
            </div>
            <div className='flex items-center gap-2'>
              <User className='h-4 w-4 text-zinc-500' />
              <span>{event.createdBy}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>{event.title}</DialogTitle>
            <DialogDescription className='space-y-4'>
              <div className='space-y-2'>
                <p className='text-sm font-semibold'>Description</p>
                <p className='text-sm text-gray-500'>{event.description}</p>
              </div>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <p className='text-sm font-semibold'>Date</p>
                  <p className='text-sm text-gray-500'>
                    {event.eventDate?.start?.toDate
                      ? event.eventDate.start.toDate().toLocaleDateString()
                      : 'No Date'}
                  </p>
                </div>
                <div>
                  <p className='text-sm font-semibold'>Time</p>
                  <p className='text-sm text-gray-500'>
                    {event.time?.startTime} - {event.time?.endTime}
                  </p>
                </div>
                <div>
                  <p className='text-sm font-semibold'>Location</p>
                  <p className='text-sm text-gray-500'>
                    {event.location?.city}, {event.location?.country}
                  </p>
                </div>
                <div>
                  <p className='text-sm font-semibold'>Price</p>
                  <p className='text-sm text-gray-500'>
                    {event.price?.amount} {event.price?.currency}
                  </p>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
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
              className='bg-red-600 hover:bg-red-700'
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default EventCard;
