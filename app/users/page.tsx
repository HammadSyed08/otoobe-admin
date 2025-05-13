"use client";
import { Search } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { getAllUsers } from "./serices";
import Loader from "@/components/Loader";
import debounce from "lodash/debounce";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const debouncedSearch = debounce((query) => {
    setSearchQuery(query);
  }, 300);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await getAllUsers();
      const data = await response;
      setUsers(data as any[]);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) => {
    const searchLower = searchQuery.toLowerCase().trim();
    if (!searchLower) return true;

    const fullNameMatch = user.fullName.toLowerCase().includes(searchLower);
    const emailMatch = user.email.toLowerCase().includes(searchLower);
    const organizationMatch = user.organizationName
      .toLowerCase()
      .includes(searchLower);
    const locationMatch = [
      user.location.city,
      user.location.state,
      user.location.country,
    ]
      .join(" ")
      .toLowerCase()
      .includes(searchLower);

    return fullNameMatch || emailMatch || organizationMatch || locationMatch;
  });

  const handleChangeStatus = async (userId: string, status: string) => {
    try {
      const docRef = doc(db, "Users", userId);
      await updateDoc(docRef, {
        status: status,
      });
      const updatedUsers = users.map((user) => {
        if (user.id === userId) {
          return { ...user, status: status };
        }
        return user;
      });
      setUsers(updatedUsers);
    } catch (error) {
      console.error("Error changing user status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-40 mx-auto">
        <Loader />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight">Users</h1>
        <p className="text-gray-400">Manage user accounts and permissions.</p>
      </div>

      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Search by name, email, organization, or location..."
            value={searchQuery}
            onChange={(e) => debouncedSearch(e.target.value)}
            className="w-full border-gray-800 bg-gray-900 pl-8 text-white placeholder:text-gray-500"
          />
        </div>
      </div>

      <div className="rounded-md border border-gray-800">
        <Table>
          <TableHeader className="bg-gray-900">
            <TableRow className="border-gray-800 hover:bg-gray-900/80">
              <TableHead className="text-gray-400">Profile</TableHead>
              <TableHead className="text-gray-400">Name</TableHead>
              <TableHead className="text-gray-400">Email</TableHead>
              <TableHead className="text-gray-400">Location</TableHead>
              <TableHead className="text-gray-400">Organization</TableHead>
              <TableHead className="text-gray-400">Bio</TableHead>
              <TableHead className="text-gray-400">Status</TableHead>
              <TableHead className="text-gray-400">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers?.map((user) => (
              <TableRow
                key={user.id}
                className="border-gray-800 hover:bg-gray-900/50"
              >
                <TableCell>
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={user.profileImage || "/placeholder.svg"}
                      alt={user.fullName}
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-gray-800">
                      {user.fullName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell className="font-medium text-white">
                  {user.fullName}
                </TableCell>
                <TableCell className="text-gray-400">{user.email}</TableCell>
                <TableCell className="text-gray-400">
                  {user.location.city}, {user.location.state},{" "}
                  {user.location.country}
                </TableCell>
                <TableCell className="text-gray-400">
                  {user.organizationName}
                </TableCell>
                <TableCell className="text-gray-400">
                  {user.bio || (
                    <span className="italic text-muted-foreground">No bio</span>
                  )}
                </TableCell>
                <TableCell
                  className={
                    user.status === "block" ? "text-red-500" : "text-green-500"
                  }
                >
                  {user.status}
                </TableCell>

                <TableCell className="text-gray-400">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      {user.status === "block" ? (
                        <Button variant="outline">Unblock user</Button>
                      ) : (
                        <Button variant="destructive">Block user</Button>
                      )}
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          {user.status === "block"
                            ? "Unblock this user?"
                            : "Block this user?"}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          {user.status === "block"
                            ? "This action will unblock the user and they will be able to access their account."
                            : "This action will block the user and they will not be able to access their account."}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction asChild>
                          <Button
                            onClick={() =>
                              handleChangeStatus(
                                user.id,
                                user.status === "block" ? "active" : "block"
                              )
                            }
                          >
                            {user.status === "block" ? "Unblock" : "Block"}
                          </Button>
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
