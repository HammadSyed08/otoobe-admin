"use client";

import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { Timestamp } from "firebase/firestore";
import { eventService } from "../services";
import { useAuth } from "@/lib/auth-context";
import eventCategories from "@/data/categories.json";
import { useRouter } from "next/navigation";

export default function CreateEventPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
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

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    // Reset subCategory if category changes
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const {
        title,
        description,
        date,
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

      const eventData = {
        title,
        description,
        date: Timestamp.fromDate(new Date(date)),
        time: {
          startTime,
          endTime,
          timeStamp: Timestamp.now(),
        },
        location: {
          city,
          country,
          latitude: 29.3737609, // placeholder for now
          longitude: 71.761516, // placeholder for now
        },
        price: {
          amount: price,
          currency,
        },
        ticketLink,
        moreInfoLink,
        createdBy: user?.email || "unknown",
        category: [
          {
            title: category,
            subCategories: [subCategory],
          },
        ],
      };

      const docId = await eventService.createEvent(eventData, imageFile);

      toast({
        title: "Event Created!",
        description: `Event ID: ${docId}`,
      });

      setFormData({
        title: "",
        description: "",
        date: "",
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
        <h2 className="text-2xl font-semibold text-gray-800">
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
              <Label>Date</Label>
              <Input
                type="date"
                name="date"
                value={formData.date}
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
              >
                <option value="">Select category</option>
                {Object.keys(eventCategories.categories).map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
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
              >
                <option value="">Select subcategory</option>
                {formData.category &&
                  eventCategories.categories[formData.category]?.map((sub) => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  ))}
              </select>
            </div>
          </div>
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
