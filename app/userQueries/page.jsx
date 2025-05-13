"use client";

import { useEffect, useState, useTransition } from "react";
import { getDocs, collection, updateDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";
import AdminLayout from "@/components/admin-layout";

const ContactUs = () => {
  const [contactList, setContactList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "contactMessages"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setContactList(data);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      toast.error("Error fetching contacts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleApprove = async (id) => {
    const ref = doc(db, "contactMessages", id);
    try {
      await updateDoc(ref, { status: "approved" });
      toast.success("Contact approved successfully");
      fetchContacts();
    } catch (err) {
      toast.error("Error approving contact");
      console.error("Error approving contact:", err);
    }
  };

  const handleReply = async (id) => {
    const reply = window.prompt("Enter your reply:");
    if (!reply) return;

    const ref = doc(db, "contactMessages", id);
    try {
      await updateDoc(ref, { reply });
      toast.success("Reply sent successfully");
      fetchContacts();
    } catch (err) {
      toast.error("Error sending reply");
      console.error("Error sending reply:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-primary">Contact Us</h1>
          <p className="text-muted-foreground">
            Manage and reply to user queries.
          </p>
        </div>
        <Separator />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {contactList.map((item) => (
            <Card key={item.id} className="flex flex-col justify-between">
              <CardHeader className=" text-black">
                <CardTitle>{item.subject}</CardTitle>
                <CardDescription className=" text-xs">
                  {item.createdAt?.seconds
                    ? new Date(item.createdAt.seconds * 1000).toLocaleString()
                    : "N/A"}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-2 py-4 text-sm">
                <p>
                  <span className="font-medium">Name:</span> {item.name}
                </p>
                <p>
                  <span className="font-medium">Email:</span> {item.email}
                </p>
                <p>
                  <span className="font-medium">User ID:</span> {item.id}
                </p>
                <p>
                  <span className="font-medium">Reply:</span>{" "}
                  {item.reply || "—"}
                </p>
                <p>
                  <span className="font-medium">Status:</span>{" "}
                  {item.status || "pending"}
                </p>
              </CardContent>

              <CardFooter className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  disabled={isPending}
                  onClick={() => startTransition(() => handleApprove(item.id))}
                >
                  Mark as Approved
                </Button>
                <Button
                  disabled={isPending}
                  onClick={() => handleReply(item.id)}
                >
                  Reply
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default ContactUs;
