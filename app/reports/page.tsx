"use client";
import {
  Search,
  MoreHorizontal,
  MessageSquare,
  CheckCircle,
  Trash2,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function ReportsPage() {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      setIsLoading(true);
      try {
        const collectionRef = collection(db, "Reports");
        const querySnapshot = await getDocs(collectionRef);
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setReports(data);
      } catch (error) {
        console.error("Error fetching reports:", error);
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReports();
  }, []);
  console.log(reports);
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
        <p className="text-gray-400">
          Manage and respond to user-submitted reports.
        </p>
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
              <TableHead className="text-gray-400">Email</TableHead>
              <TableHead className="text-gray-400">Report</TableHead>
              <TableHead className="text-gray-400">Date</TableHead>
              <TableHead className="text-right text-gray-400">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {reports.map((report) => (
              <TableRow
                key={report.id}
                className="border-gray-800 hover:bg-gray-900/50"
              >
                <TableCell className="text-white">{report.email}</TableCell>
                <TableCell className="text-gray-400">{report.report}</TableCell>
                <TableCell className="text-gray-400">
                  {report.timeStamp?.toDate().toLocaleString() || "N/A"}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-gray-400 hover:text-white"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="bg-gray-900 text-white"
                    >
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
  );
}
