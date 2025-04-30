import type { Metadata } from "next";
import { Search, MoreHorizontal, Check, Ban, Shield } from "lucide-react";

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

export const metadata: Metadata = {
  title: "Users | Admin Panel",
  description: "Manage users",
};

const users = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    role: "User",
    status: "Active",
    avatar: "/placeholder-user.jpg",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "Admin",
    status: "Active",
    avatar: "/placeholder-user.jpg",
  },
  {
    id: "3",
    name: "Mike Johnson",
    email: "mike@example.com",
    role: "User",
    status: "Inactive",
    avatar: "/placeholder-user.jpg",
  },
  {
    id: "4",
    name: "Sarah Williams",
    email: "sarah@example.com",
    role: "Moderator",
    status: "Active",
    avatar: "/placeholder-user.jpg",
  },
  {
    id: "5",
    name: "David Brown",
    email: "david@example.com",
    role: "User",
    status: "Banned",
    avatar: "/placeholder-user.jpg",
  },
  {
    id: "6",
    name: "Emily Davis",
    email: "emily@example.com",
    role: "User",
    status: "Active",
    avatar: "/placeholder-user.jpg",
  },
  {
    id: "7",
    name: "Robert Wilson",
    email: "robert@example.com",
    role: "User",
    status: "Active",
    avatar: "/placeholder-user.jpg",
  },
  {
    id: "8",
    name: "Lisa Taylor",
    email: "lisa@example.com",
    role: "User",
    status: "Inactive",
    avatar: "/placeholder-user.jpg",
  },
];

export default function UsersPage() {
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
            placeholder="Search users..."
            className="w-full border-gray-800 bg-gray-900 pl-8 text-white placeholder:text-gray-500"
          />
        </div>
      </div>

      <div className="rounded-md border border-gray-800">
        <Table>
          <TableHeader className="bg-gray-900">
            <TableRow className="border-gray-800 hover:bg-gray-900/80">
              <TableHead className="text-gray-400">Name</TableHead>
              <TableHead className="text-gray-400">Email</TableHead>
              <TableHead className="text-gray-400">Role</TableHead>
              <TableHead className="text-gray-400">Status</TableHead>
              <TableHead className="text-right text-gray-400">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow
                key={user.id}
                className="border-gray-800 hover:bg-gray-900/50"
              >
                <TableCell className="flex items-center gap-3 font-medium text-white">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={user.avatar || "/placeholder.svg"}
                      alt={user.name}
                    />
                    <AvatarFallback className="bg-gray-800">
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  {user.name}
                </TableCell>
                <TableCell className="text-gray-400">{user.email}</TableCell>
                <TableCell>
                  <div
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      user.role === "Admin"
                        ? "bg-purple-950 text-purple-400"
                        : user.role === "Moderator"
                        ? "bg-blue-950 text-blue-400"
                        : "bg-gray-800 text-gray-400"
                    }`}
                  >
                    {user.role}
                  </div>
                </TableCell>
                <TableCell>
                  <div
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      user.status === "Active"
                        ? "bg-green-950 text-green-400"
                        : user.status === "Inactive"
                        ? "bg-yellow-950 text-yellow-400"
                        : "bg-red-950 text-red-400"
                    }`}
                  >
                    {user.status}
                  </div>
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
                        <Check className="h-4 w-4" /> View Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex items-center gap-2 hover:bg-gray-800">
                        <Shield className="h-4 w-4" /> Change Role
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex items-center gap-2 hover:bg-gray-800">
                        <Ban className="h-4 w-4" /> Ban User
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
