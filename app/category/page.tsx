"use client";

import React, { useEffect, useState } from "react";
import AdminLayout from "@/components/admin-layout";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";

// shadcn UI imports
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ImagePlus, ArrowUp, ArrowDown } from "lucide-react";

type Category = {
  id: string;
  name: string;
  imageUrl?: string;
  order?: number;
};

type SubCategory = {
  id: string;
  name: string;
  categoryId: string;
};

const DEFAULT_CATEGORY_IMAGE = "/images/default-category.jpg";

const CategoryPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [categoryName, setCategoryName] = useState("");
  const [subCategoryName, setSubCategoryName] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingSubCategory, setEditingSubCategory] =
    useState<SubCategory | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      const catSnap = await getDocs(collection(db, "categories"));
      const cats = catSnap.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as Category)
      );
      setCategories(cats.sort((a, b) => (a.order || 0) - (b.order || 0)));

      const subCatSnap = await getDocs(collection(db, "subCategories"));
      setSubCategories(
        subCatSnap.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() } as SubCategory)
        )
      );
    };
    fetchData();
  }, []);

  // Category CRUD
  const handleAddCategory = async () => {
    if (!categoryName.trim()) return;
    try {
      toast({ description: "Adding category..." });
      const docRef = await addDoc(collection(db, "categories"), {
        name: categoryName,
        imageUrl: "",
        order: categories.length,
      });
      setCategories([
        ...categories,
        {
          id: docRef.id,
          name: categoryName,
          imageUrl: "",
          order: categories.length,
        },
      ]);
      setCategoryName("");
      toast({ description: "Category added successfully", variant: "success" });
    } catch (error) {
      toast({ description: "Failed to add category", variant: "destructive" });
    }
  };

  const handleEditCategory = (cat: Category) => {
    setEditingCategory(cat);
    setCategoryName(cat.name);
  };

  const handleUpdateCategory = async () => {
    if (!editingCategory) return;
    try {
      toast({ description: "Updating category..." });
      await updateDoc(doc(db, "categories", editingCategory.id), {
        name: categoryName,
      });
      setCategories(
        categories.map((cat) =>
          cat.id === editingCategory.id ? { ...cat, name: categoryName } : cat
        )
      );
      setEditingCategory(null);
      setCategoryName("");
      toast({
        description: "Category updated successfully",
        variant: "success",
      });
    } catch (error) {
      toast({
        description: "Failed to update category",
        variant: "destructive",
      });
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      toast({ description: "Deleting category..." });
      await deleteDoc(doc(db, "categories", id));
      setCategories(categories.filter((cat) => cat.id !== id));
      setSubCategories(subCategories.filter((sub) => sub.categoryId !== id));
      if (selectedCategoryId === id) setSelectedCategoryId("");
      toast({
        description: "Category deleted successfully",
        variant: "success",
      });
    } catch (error) {
      toast({
        description: "Failed to delete category",
        variant: "destructive",
      });
    }
  };

  // Image Upload
  const handleImageUpload = async (file: File, categoryId: string) => {
    if (!file) return;

    try {
      setIsUploading(true);
      toast({ description: "Uploading image..." });
      const storageRef = ref(
        storage,
        `category-images/${categoryId}/${file.name}`
      );
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);

      await updateDoc(doc(db, "categories", categoryId), {
        imageUrl: downloadURL,
      });

      setCategories(
        categories.map((cat) =>
          cat.id === categoryId ? { ...cat, imageUrl: downloadURL } : cat
        )
      );
      toast({ description: "Image uploaded successfully", variant: "success" });
    } catch (error) {
      toast({ description: "Failed to upload image", variant: "destructive" });
    } finally {
      setIsUploading(false);
    }
  };

  // Category Reordering
  const moveCategory = async (categoryId: string, direction: "up" | "down") => {
    try {
      const categoryIndex = categories.findIndex(
        (cat) => cat.id === categoryId
      );
      if (
        (direction === "up" && categoryIndex <= 0) ||
        (direction === "down" && categoryIndex >= categories.length - 1)
      ) {
        return;
      }

      toast({ description: "Updating order..." });
      const newIndex =
        direction === "up" ? categoryIndex - 1 : categoryIndex + 1;
      const newCategories = [...categories];

      const tempOrder = newCategories[categoryIndex].order;
      newCategories[categoryIndex].order = newCategories[newIndex].order;
      newCategories[newIndex].order = tempOrder;

      await Promise.all([
        updateDoc(doc(db, "categories", categoryId), {
          order: newCategories[categoryIndex].order,
        }),
        updateDoc(doc(db, "categories", newCategories[newIndex].id), {
          order: newCategories[newIndex].order,
        }),
      ]);

      setCategories(
        newCategories.sort((a, b) => (a.order || 0) - (b.order || 0))
      );
      toast({ description: "Order updated successfully", variant: "success" });
    } catch (error) {
      toast({ description: "Failed to update order", variant: "destructive" });
    }
  };

  // SubCategory CRUD
  const handleAddSubCategory = async () => {
    if (!subCategoryName.trim() || !selectedCategoryId) return;
    try {
      toast({ description: "Adding subcategory..." });
      const docRef = await addDoc(collection(db, "subCategories"), {
        name: subCategoryName,
        categoryId: selectedCategoryId,
      });
      setSubCategories([
        ...subCategories,
        {
          id: docRef.id,
          name: subCategoryName,
          categoryId: selectedCategoryId,
        },
      ]);
      setSubCategoryName("");
      toast({
        description: "Subcategory added successfully",
        variant: "success",
      });
    } catch (error) {
      toast({
        description: "Failed to add subcategory",
        variant: "destructive",
      });
    }
  };

  const handleEditSubCategory = (sub: SubCategory) => {
    setEditingSubCategory(sub);
    setSubCategoryName(sub.name);
    setSelectedCategoryId(sub.categoryId);
  };

  const handleUpdateSubCategory = async () => {
    if (!editingSubCategory) return;
    try {
      toast({ description: "Updating subcategory..." });
      await updateDoc(doc(db, "subCategories", editingSubCategory.id), {
        name: subCategoryName,
        categoryId: selectedCategoryId,
      });
      setSubCategories(
        subCategories.map((sub) =>
          sub.id === editingSubCategory.id
            ? { ...sub, name: subCategoryName, categoryId: selectedCategoryId }
            : sub
        )
      );
      setEditingSubCategory(null);
      setSubCategoryName("");
      toast({
        description: "Subcategory updated successfully",
        variant: "success",
      });
    } catch (error) {
      toast({
        description: "Failed to update subcategory",
        variant: "destructive",
      });
    }
  };

  const handleDeleteSubCategory = async (id: string) => {
    try {
      toast({ description: "Deleting subcategory..." });
      await deleteDoc(doc(db, "subCategories", id));
      setSubCategories(subCategories.filter((sub) => sub.id !== id));
      toast({
        description: "Subcategory deleted successfully",
        variant: "success",
      });
    } catch (error) {
      toast({
        description: "Failed to delete subcategory",
        variant: "destructive",
      });
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto space-y-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                editingCategory ? handleUpdateCategory() : handleAddCategory();
              }}
              className="flex gap-2 items-end"
            >
              <div className="flex-1">
                <Label htmlFor="categoryName">Category name</Label>
                <Input
                  id="categoryName"
                  type="text"
                  placeholder="Category name"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  className="mt-1"
                />
              </div>
              <Button type="submit" className="whitespace-nowrap">
                {editingCategory ? "Update" : "Add"}
              </Button>
              {editingCategory && (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setEditingCategory(null);
                    setCategoryName("");
                  }}
                >
                  Cancel
                </Button>
              )}
            </form>
            <ul className="mt-6 space-y-2">
              {categories.map((cat) => (
                <li
                  key={cat.id}
                  className={`flex items-center justify-between rounded px-4 py-3 ${
                    selectedCategoryId === cat.id
                      ? "bg-muted font-semibold"
                      : "bg-muted/50"
                  }`}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="relative   rounded-md overflow-hidden  ">
                      {isUploading && cat.id === selectedCategoryId ? (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <span className="text-xs">Uploading...</span>
                        </div>
                      ) : (
                        <div className="flex justify-between gap-3">
                          <img
                            src={cat.imageUrl || DEFAULT_CATEGORY_IMAGE}
                            alt={cat.name}
                            className="w-12 h-12 object-cover "
                          />
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              if (e.target.files?.[0]) {
                                handleImageUpload(e.target.files[0], cat.id);
                              }
                            }}
                          />
                        </div>
                      )}
                    </div>
                    <span
                      className="cursor-pointer"
                      onClick={() => setSelectedCategoryId(cat.id)}
                    >
                      {cat.name}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 w-8 p-0"
                      onClick={() => moveCategory(cat.id, "up")}
                      disabled={
                        categories.findIndex((c) => c.id === cat.id) === 0
                      }
                    >
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 w-8 p-0"
                      onClick={() => moveCategory(cat.id, "down")}
                      disabled={
                        categories.findIndex((c) => c.id === cat.id) ===
                        categories.length - 1
                      }
                    >
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditCategory(cat)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteCategory(cat.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>SubCategories</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                editingSubCategory
                  ? handleUpdateSubCategory()
                  : handleAddSubCategory();
              }}
              className="flex flex-col md:flex-row gap-2 items-end"
            >
              <div className="w-full md:w-1/3">
                <Label htmlFor="categorySelect">Category</Label>
                <Select
                  value={selectedCategoryId}
                  onValueChange={setSelectedCategoryId}
                >
                  <SelectTrigger id="categorySelect" className="mt-1">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-full md:w-1/3">
                <Label htmlFor="subCategoryName">SubCategory name</Label>
                <Input
                  id="subCategoryName"
                  type="text"
                  placeholder="SubCategory name"
                  value={subCategoryName}
                  onChange={(e) => setSubCategoryName(e.target.value)}
                  className="mt-1"
                />
              </div>
              <Button type="submit" className="whitespace-nowrap">
                {editingSubCategory ? "Update" : "Add"}
              </Button>
              {editingSubCategory && (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setEditingSubCategory(null);
                    setSubCategoryName("");
                  }}
                >
                  Cancel
                </Button>
              )}
            </form>
            <ul className="mt-6 space-y-2">
              {subCategories
                .filter((sub) => sub.categoryId === selectedCategoryId)
                .map((sub) => (
                  <li
                    key={sub.id}
                    className="flex items-center justify-between rounded px-4 py-3 bg-muted/50"
                  >
                    <span className="flex-1">{sub.name}</span>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditSubCategory(sub)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteSubCategory(sub.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </li>
                ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default CategoryPage;
