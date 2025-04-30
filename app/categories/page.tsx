import type { Metadata } from "next";
import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const metadata: Metadata = {
  title: "Categories | Admin Panel",
  description: "Manage event categories",
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState([
    { id: "1", name: "Conference" },
    { id: "2", name: "Workshop" },
    { id: "3", name: "Festival" },
  ]);
  const [newCategory, setNewCategory] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState("");

  const handleAdd = () => {
    if (newCategory.trim()) {
      setCategories([
        ...categories,
        { id: Date.now().toString(), name: newCategory.trim() },
      ]);
      setNewCategory("");
    }
  };

  const handleEdit = (id: string) => {
    setEditingId(id);
    setEditingValue(categories.find((c) => c.id === id)?.name || "");
  };

  const handleSave = (id: string) => {
    setCategories(
      categories.map((c) => (c.id === id ? { ...c, name: editingValue } : c))
    );
    setEditingId(null);
    setEditingValue("");
  };

  const handleDelete = (id: string) => {
    setCategories(categories.filter((c) => c.id !== id));
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight">Categories</h1>
        <p className="text-gray-400">
          Manage event categories for your platform.
        </p>
      </div>
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Add new category..."
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          className="w-full border-gray-800 bg-gray-900 text-white placeholder:text-gray-500"
        />
        <Button
          className="bg-gray-100 text-black hover:bg-white"
          onClick={handleAdd}
        >
          <Plus className="mr-2 h-4 w-4" /> Add
        </Button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <Card
            key={category.id}
            className="overflow-hidden border-gray-800 bg-gray-900"
          >
            <CardContent className="p-4 flex items-center justify-between">
              {editingId === category.id ? (
                <>
                  <Input
                    value={editingValue}
                    onChange={(e) => setEditingValue(e.target.value)}
                    className="border-gray-800 bg-gray-900 text-white mr-2"
                  />
                  <Button
                    size="sm"
                    className="mr-2"
                    onClick={() => handleSave(category.id)}
                  >
                    Save
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setEditingId(null)}
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <>
                  <span className="font-semibold text-white">
                    {category.name}
                  </span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-gray-400 hover:text-white"
                      >
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="bg-gray-900 text-white"
                    >
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-gray-800" />
                      <DropdownMenuItem
                        className="flex items-center gap-2 hover:bg-gray-800"
                        onClick={() => handleEdit(category.id)}
                      >
                        <Pencil className="h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="flex items-center gap-2 hover:bg-gray-800"
                        onClick={() => handleDelete(category.id)}
                      >
                        <Trash2 className="h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
