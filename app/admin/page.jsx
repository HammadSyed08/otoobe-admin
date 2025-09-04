"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import {
  getFirestore,
  collection,
  getDocs,
  deleteDoc,
  doc,
  setDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
// import { useLanguage } from "@/lib/i18n/language-context";
import secondaryAuth from "@/lib/firebaseadmin";
import AdminLayout from "@/components/admin-layout";
import { Eye, EyeOff, Trash2, Loader2 } from "lucide-react";

// const auth = getAuth(app);
// const db = getFirestore(app);

const AdminSubAdminPage = () => {
  const { toast } = useToast();
  // const { translate } = useLanguage();
  const [subAdmins, setSubAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const fetchSubAdmins = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "subAdmins"));
      const data = [];
      querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() });
      });
      setSubAdmins(data);
    } catch (error) {
      toast({
        title: "Failed to fetch",
        description: error.message,
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSubAdmins();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!form.email.includes("@") || form.password.length < 6) {
      toast({
        title: "Invalid input",
        description: "Email must be valid and password at least 6 characters.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        secondaryAuth,
        form.email,
        form.password
      );
      const user = userCredential.user;

      await setDoc(doc(db, "subAdmins", form.email), {
        uid: user.uid,
        email: form.email,
        createdAt: new Date(),
        role: "subAdmin",
      });

      toast({ title: "Sub-admin created successfully!" });
      setForm({ email: "", password: "" });
      fetchSubAdmins();
      await secondaryAuth.signOut();
    } catch (error) {
      console.error("Firebase Error:", error);
      toast({
        title: "Error creating sub-admin",
        description: error.message,
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await deleteDoc(doc(db, "subAdmins", id));
      toast({ title: "Sub-admin deleted successfully!" });
      fetchSubAdmins();
    } catch (error) {
      toast({
        title: "Delete failed",
        description: error.message,
        variant: "destructive",
      });
    }
    setLoading(false);
  };
  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto px-4 py-10 space-y-10">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-[#00507F] mt-10">
            Admin Management
          </h1>
          <p className="text-muted-foreground text-sm mt-2">
            Manage sub-admin accounts and their access.
          </p>
        </div>

        {/* Create Sub-admin */}
        <Card className="shadow-sm border border-gray-200 mt-12">
          <CardHeader>
            <CardTitle className="text-lg">Create Sub-admin</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={handleCreate}
              className="grid grid-cols-1 sm:grid-cols-3 gap-4"
            >
              <Input
                type="email"
                placeholder="Sub-admin Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                disabled={loading}
              />
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  required
                  disabled={loading}
                  className="pr-10"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-primary"
                  onClick={() => setShowPassword((prev) => !prev)}
                  disabled={loading}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="sm:col-span-1"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Sub-admin List */}
        <Card className="shadow-sm border border-gray-200 mt-12">
          <CardHeader>
            <CardTitle className="text-lg">Sub-admin List</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subAdmins.length > 0 ? (
                  subAdmins.map((sub) => (
                    <TableRow key={sub.id}>
                      <TableCell>{sub.email}</TableCell>
                      <TableCell>{sub.role}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(sub.id)}
                          className="hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className="py-6 text-center text-muted-foreground"
                    >
                      No sub-admins found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminSubAdminPage;
