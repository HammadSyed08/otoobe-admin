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
import { db } from "@/lib/firebase";

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

type Category = {
  id: string;
  name: string;
};

type SubCategory = {
  id: string;
  name: string;
  categoryId: string;
};

const CategoryPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [categoryName, setCategoryName] = useState("");
  const [subCategoryName, setSubCategoryName] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingSubCategory, setEditingSubCategory] =
    useState<SubCategory | null>(null);

  // Fetch categories and subcategories
  useEffect(() => {
    const fetchData = async () => {
      const catSnap = await getDocs(collection(db, "categories"));
      setCategories(
        catSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Category))
      );
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
    const docRef = await addDoc(collection(db, "categories"), {
      name: categoryName,
    });
    setCategories([...categories, { id: docRef.id, name: categoryName }]);
    setCategoryName("");
  };

  const handleEditCategory = (cat: Category) => {
    setEditingCategory(cat);
    setCategoryName(cat.name);
  };

  const handleUpdateCategory = async () => {
    if (!editingCategory) return;
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
  };

  const handleDeleteCategory = async (id: string) => {
    await deleteDoc(doc(db, "categories", id));
    setCategories(categories.filter((cat) => cat.id !== id));
    setSubCategories(subCategories.filter((sub) => sub.categoryId !== id));
    if (selectedCategoryId === id) setSelectedCategoryId("");
  };

  // SubCategory CRUD
  const handleAddSubCategory = async () => {
    if (!subCategoryName.trim() || !selectedCategoryId) return;
    const docRef = await addDoc(collection(db, "subCategories"), {
      name: subCategoryName,
      categoryId: selectedCategoryId,
    });
    setSubCategories([
      ...subCategories,
      { id: docRef.id, name: subCategoryName, categoryId: selectedCategoryId },
    ]);
    setSubCategoryName("");
  };

  const handleEditSubCategory = (sub: SubCategory) => {
    setEditingSubCategory(sub);
    setSubCategoryName(sub.name);
    setSelectedCategoryId(sub.categoryId);
  };

  const handleUpdateSubCategory = async () => {
    if (!editingSubCategory) return;
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
  };

  const handleDeleteSubCategory = async (id: string) => {
    await deleteDoc(doc(db, "subCategories", id));
    setSubCategories(subCategories.filter((sub) => sub.id !== id));
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
                  className={`flex items-center justify-between rounded px-2 py-1 ${
                    selectedCategoryId === cat.id
                      ? "bg-muted font-semibold"
                      : ""
                  }`}
                >
                  <span
                    className="cursor-pointer flex-1"
                    onClick={() => setSelectedCategoryId(cat.id)}
                  >
                    {cat.name}
                  </span>
                  <div className="flex gap-1">
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
              <div className="flex-1">
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
              <div className="flex-1">
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
                    className="flex items-center justify-between rounded px-2 py-1"
                  >
                    <span className="flex-1">{sub.name}</span>
                    <div className="flex gap-1">
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
