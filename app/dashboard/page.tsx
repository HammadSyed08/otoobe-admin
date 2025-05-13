"use client";

import { ArrowUpRight, Users, Calendar, Flag } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase"; // adjust path to your Firebase config
import { collection, getDocs } from "firebase/firestore";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function DashboardPage() {
  const [usersCount, setUsersCount] = useState(0);
  const [events, setEvents] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const usersSnapshot = await getDocs(collection(db, "Users"));
        const eventsSnapshot = await getDocs(collection(db, "Events"));
        const reportsSnapshot = await getDocs(collection(db, "Reports"));

        setUsersCount(usersSnapshot.size);

        const eventData = eventsSnapshot.docs.map((doc) => doc.data());
        const sortedEvents = eventData.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        setEvents(sortedEvents.slice(0, 4));

        const reportData = reportsSnapshot.docs.map((doc) => doc.data());
        const sortedReports = reportData.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setReports(sortedReports.slice(0, 4));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const upcomingEvents = events.filter((e) => e.status === "Upcoming").length;

  console.log(reports[0]?.reportedBy[0]);

  if (loading) {
    return (
      <>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10 p-6 mt-12">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
        <div className="grid gap-6 lg:grid-cols-2  lg:gap-10 p-6">
          <Card className="border-gray-800 bg-gray-900 animate-pulse h-64" />
          <Card className="border-gray-800 bg-gray-900 animate-pulse h-64" />
        </div>
      </>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-gray-400">
          Welcome back, Admin. Here's an overview of your platform.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="border-gray-800 bg-gray-900">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">
              Total Users
            </CardTitle>
            <Users className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{usersCount}</div>
          </CardContent>
        </Card>
        <Card className="border-gray-800 bg-gray-900">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">
              Upcoming Events
            </CardTitle>
            <Calendar className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {upcomingEvents}
            </div>
          </CardContent>
        </Card>
        <Card className="border-gray-800 bg-gray-900">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">
              Pending Reports
            </CardTitle>
            <Flag className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {reports.length}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-gray-800 bg-gray-900">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Events</CardTitle>
              <CardDescription className="text-gray-400">
                Latest events created on the platform
              </CardDescription>
            </div>
            <Link
              href="/events"
              className="flex items-center gap-1 text-sm text-gray-400 hover:text-white"
            >
              View all
              <ArrowUpRight className="h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {events.map((event) => (
                <div
                  key={event.name}
                  className="flex items-center justify-between rounded-md border border-gray-800 bg-gray-950 p-3"
                >
                  <div>
                    <div className="font-medium text-white">{event.title}</div>
                    <div className="text-xs text-gray-400">
                      {event.date.toDate().toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <img
                      alt="Event"
                      className="h-16 w-16 rounded-md object-cover"
                      src={event.images[0]}
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = "/images/placeholder.png"; // Placeholder image
                      }}
                    />
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
              <CardDescription className="text-gray-400">
                Latest reports submitted by users
              </CardDescription>
            </div>
            <Link
              href="/reports"
              className="flex items-center gap-1 text-sm text-gray-400 hover:text-white"
            >
              View all
              <ArrowUpRight className="h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reports.map((report) => (
                <div
                  key={report.user + report.issue}
                  className="flex items-center justify-between rounded-md border border-gray-800 bg-gray-950 p-3"
                >
                  {report.reportedBy.map((reporter, index) => (
                    <div
                      className="flex justify-between items-center w-full"
                      key={index}
                    >
                      <div>
                        <div className="font-medium text-white">
                          {reporter.email}
                        </div>
                        <div className="text-xs text-gray-400">
                          {reporter.report}
                        </div>
                        <div className="text-xs text-gray-500">
                          {reporter.timestamp.toDate().toLocaleString()}
                        </div>
                      </div>
                      <div
                        className={`rounded-full px-2 py-1 text-xs font-medium ${
                          reporter.status === "pending"
                            ? "bg-red-950 text-red-400"
                            : report.status === "approved"
                            ? "bg-yellow-950 text-yellow-400"
                            : "bg-green-950 text-green-400"
                        }`}
                      >
                        {reporter.status}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

const SkeletonCard = () => (
  <Card className="border-gray-800 bg-gray-900 animate-pulse">
    <CardHeader className="pb-2">
      <div className="h-4 w-24 rounded bg-gray-800 mb-2" />
      <div className="h-4 w-4 rounded-full bg-gray-800" />
    </CardHeader>
    <CardContent>
      <div className="h-6 w-16 rounded bg-gray-800" />
    </CardContent>
  </Card>
);
