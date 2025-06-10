"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { eventService } from "../services";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase"; // adjust import to your firebase config
import {
  collection,
  getDocs,
  query,
  where,
  DocumentData,
  updateDoc,
} from "firebase/firestore";
import { Timestamp } from "firebase/firestore";

export default function CreateEventPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [categories, setCategories] = useState<DocumentData[]>([]);
  const [subCategories, setSubCategories] = useState<DocumentData[]>([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    endDate: "",
    startTime: "",
    endTime: "",
    city: "",
    country: "",
    price: "",
    currency: "",
    ticketLink: "",
    moreInfoLink: "",
    category: "",
    subCategory: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      const catSnap = await getDocs(collection(db, "categories"));
      setCategories(catSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };
    fetchCategories();
  }, []);

  // Fetch subcategories when category changes
  useEffect(() => {
    if (!formData.category) {
      setSubCategories([]);
      setFormData((prev) => ({ ...prev, subCategory: "" }));
      return;
    }
    const fetchSubCategories = async () => {
      const subCatQuery = query(
        collection(db, "subCategories"),
        where("categoryId", "==", formData.category)
      );
      const subCatSnap = await getDocs(subCatQuery);
      setSubCategories(
        subCatSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
    };
    fetchSubCategories();
  }, [formData.category]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    if (name === "category") {
      setFormData({ ...formData, [name]: value, subCategory: "" });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImageFile(e.target.files[0]);
    }
  };

  // Dummy geocode function (replace with real one)
  async function geocode(city: string, country: string) {
    // Replace with real geocoding logic
    return { latitude: 0, longitude: 0 };
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const {
        title,
        description,
        date,
        endDate,
        startTime,
        endTime,
        city,
        country,
        price,
        currency,
        ticketLink,
        moreInfoLink,
        category,
        subCategory,
      } = formData;

      // Get geo-coordinates
      const { latitude, longitude } = await geocode(city, country);

      // Prepare Firestore data to match Event type
      const categoryObj = categories.find((cat) => cat.id === category);
      const subCategoryObj = subCategories.find(
        (sub) => sub.id === subCategory
      );

      const eventData = {
        category: [
          {
            title: categoryObj?.name || "",
            subCategories: [subCategoryObj?.name || ""],
          },
        ],
        createdBy: user?.email || "unknown",
        description,
        eventDate: {
          end: Timestamp.fromDate(new Date(endDate)),
          start: Timestamp.fromDate(new Date(endDate)),
        },
        images: [],
        location: {
          city,
          country,
          latitude,
          longitude,
        },
        moreInfoLink,
        price: {
          currency,
          end: "",
          start: "",
        },
        ticketLink,
        time: {
          endTime,
          startTime,
        },
        timeStamp: Timestamp.now(),
        title,
      };

      // Save to Firestore (and upload image)
      const docId = await eventService.createEvent(eventData, imageFile);
      console.log(imageFile);

      toast({
        title: "Event Created!",
        description: `Event ID: ${docId}`,
      });

      setImageFile(null);
      router.push("/events");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create event.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-4xl mx-auto my-10 bg-gray-950 shadow-md">
      <CardContent className="p-6 space-y-6">
        <h2 className="text-2xl font-semibold text-gray-100">
          Create New Event
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label>Title</Label>
            <Input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter event title"
              required
            />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter event description"
              required
            />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <Label>Start Date</Label>
              <Input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex-1">
              <Label>End Date</Label>
              <Input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex-1">
              <Label>Start Time</Label>
              <Input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex-1">
              <Label>End Time</Label>
              <Input
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <Label>City</Label>
              <Input
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Enter city"
                required
              />
            </div>
            <div className="flex-1">
              <Label>Country</Label>
              <Input
                name="country"
                value={formData.country}
                onChange={handleChange}
                placeholder="Enter country"
                required
              />
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <Label>Price</Label>
              <Input
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Enter price"
                required
              />
            </div>
            <div className="flex-1">
              <Label>Currency</Label>
              <Input
                name="currency"
                value={formData.currency}
                onChange={handleChange}
                placeholder="Enter currency (e.g., USD)"
                required
              />
            </div>
          </div>
          <div>
            <Label>Ticket Link</Label>
            <Input
              name="ticketLink"
              value={formData.ticketLink}
              type="url"
              onChange={handleChange}
              placeholder="Enter ticket link (optional)"
            />
          </div>
          <div>
            <Label>More Info Link</Label>
            <Input
              name="moreInfoLink"
              value={formData.moreInfoLink}
              onChange={handleChange}
              type="url"
              placeholder="Enter more info link (optional)"
            />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <Label>Category</Label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 "
                required
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <Label>Subcategory</Label>
              <select
                name="subCategory"
                value={formData.subCategory}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 "
                required
              >
                <option value="">Select subcategory</option>
                {subCategories.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {/* ...rest of the form... */}
          <div>
            <Label>Event Image</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="text-gray-700"
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full ">
            {loading ? (
              <Loader2 className="animate-spin w-4 h-4" />
            ) : (
              "Create Event"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
