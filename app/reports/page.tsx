"use client";
import {
  Search,
  MoreHorizontal,
  MessageSquare,
  CheckCircle,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Loader from "@/components/Loader";

export default function ReportsPage() {
  const [reports, setReports] = useState([]);
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState(null);
  const [selectedEntryIndex, setSelectedEntryIndex] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setIsLoading(true);
        const snapshot = await getDocs(collection(db, "Reports"));
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setReports(data);
      } catch (error) {
        console.error("Error fetching reports:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReports();
  }, []);

  const handleReply = (reportId: string, entryIndex: number) => {
    setSelectedReportId(reportId);
    setSelectedEntryIndex(entryIndex);
    setIsReplyModalOpen(true);
  };

  const submitReply = async () => {
    if (!selectedReportId || selectedEntryIndex === null) return;

    const reportRef = doc(db, "Reports", selectedReportId);
    const report = reports.find((r) => r.id === selectedReportId);

    const updatedEntries = [...report.reportedBy];
    updatedEntries[selectedEntryIndex].reply = replyText;

    await updateDoc(reportRef, { reportedBy: updatedEntries });

    setReports((prev) =>
      prev.map((r) =>
        r.id === selectedReportId ? { ...r, reportedBy: updatedEntries } : r
      )
    );

    setReplyText("");
    setIsReplyModalOpen(false);
  };

  const handleApprove = async (reportId: string, entryIndex: number) => {
    const reportRef = doc(db, "Reports", reportId);
    const report = reports.find((r) => r.id === reportId);

    const updatedEntries = [...report.reportedBy];
    updatedEntries[entryIndex].status = "approved";

    await updateDoc(reportRef, { reportedBy: updatedEntries });

    setReports((prev) =>
      prev.map((r) =>
        r.id === reportId ? { ...r, reportedBy: updatedEntries } : r
      )
    );
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center lg:p-40 p-20">
        <Loader />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
        <p className="text-muted-foreground">
          Manage and respond to user-submitted reports.
        </p>
      </div>

      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search reports..."
            className="w-full pl-8"
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Report</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Reply</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports.map((report) =>
              report.reportedBy?.map((entry, index) => (
                <TableRow key={`${report.id}-${index}`}>
                  <TableCell>{entry.email}</TableCell>
                  <TableCell>{entry.report}</TableCell>
                  <TableCell>{entry.status}</TableCell>
                  <TableCell>
                    {entry.reply || (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {entry.timestamp?.toDate().toLocaleString() || "N/A"}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleReply(report.id, index)}
                        >
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Reply
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleApprove(report.id, index)}
                        >
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Mark as Approved
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Reply Modal */}
      <Dialog open={isReplyModalOpen} onOpenChange={setIsReplyModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reply to Report</DialogTitle>
          </DialogHeader>
          <Textarea
            placeholder="Enter your reply..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
          />
          <DialogFooter>
            <Button
              variant="secondary"
              onClick={() => setIsReplyModalOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={submitReply}>Send Reply</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
