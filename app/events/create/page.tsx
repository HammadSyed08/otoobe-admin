"use client";
import { useState } from "react";
import { Plus, Pencil, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const initialEvents = [
  // Example event
];

const initialCategories = [
  { id: "1", name: "Conference" },
  { id: "2", name: "Workshop" },
  { id: "3", name: "Festival" },
];

export default function EventFormPage() {
  const [events, setEvents] = useState(initialEvents);
  const [categories, setCategories] = useState(initialCategories);
  const [form, setForm] = useState({
    id: "",
    img: "",
    title: "",
    description: "",
    date: "",
    category: "",
    timeFrom: "",
    timeTo: "",
    location: "",
    ticketUrl: "",
    infoUrl: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [imgPreview, setImgPreview] = useState<string>("");

  const handleInput = (e: any) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleImage = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, img: file });
      setImgPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (!form.title || !form.date || !form.category) return;
    if (editingId) {
      setEvents(
        events.map((ev) =>
          ev.id === editingId
            ? { ...form, id: editingId, img: imgPreview || form.img }
            : ev
        )
      );
      setEditingId(null);
    } else {
      setEvents([
        ...events,
        { ...form, id: Date.now().toString(), img: imgPreview || form.img },
      ]);
    }
    setForm({
      id: "",
      img: "",
      title: "",
      description: "",
      date: "",
      category: "",
      timeFrom: "",
      timeTo: "",
      location: "",
      ticketUrl: "",
      infoUrl: "",
    });
    setImgPreview("");
  };

  const handleEdit = (id: string) => {
    const ev = events.find((ev) => ev.id === id);
    if (ev) {
      setForm(ev);
      setEditingId(id);
      setImgPreview(typeof ev.img === "string" ? ev.img : "");
    }
  };

  const handleDelete = (id: string) => {
    setEvents(events.filter((ev) => ev.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setForm({
        id: "",
        img: "",
        title: "",
        description: "",
        date: "",
        category: "",
        timeFrom: "",
        timeTo: "",
        location: "",
        ticketUrl: "",
        infoUrl: "",
      });
      setImgPreview("");
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <h1 className="text-2xl font-bold tracking-tight">Event Management</h1>
      <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-2">
          <label className="text-white">Image</label>
          <div className="flex items-center gap-2">
            <Input type="file" accept="image/*" onChange={handleImage} />
            {imgPreview && (
              <img
                src={imgPreview}
                alt="preview"
                className="h-16 w-24 object-cover rounded"
              />
            )}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-white">Title</label>
          <Input
            name="title"
            value={form.title}
            onChange={handleInput}
            required
            placeholder="e.g. Summer Music Festival"
          />
        </div>
        <div className="flex flex-col gap-2 md:col-span-2">
          <label className="text-white">Description</label>
          <Textarea
            name="description"
            value={form.description}
            onChange={handleInput}
            placeholder="Describe the event, guests, highlights, etc."
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-white">Date</label>
          <Input
            type="date"
            name="date"
            value={form.date}
            onChange={handleInput}
            required
            placeholder="Select event date"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-white">Category</label>
          <Select
            value={form.category}
            onValueChange={(value) => setForm({ ...form, category: value })}
          >
            <SelectTrigger className="w-full border border-gray-800 rounded px-2 py-2 bg-transparent text-white">
              <SelectValue placeholder="Select category (e.g. Conference)" />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 text-white">
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.name}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-white">Time (From)</label>
          <Input
            type="time"
            name="timeFrom"
            value={form.timeFrom}
            onChange={handleInput}
            placeholder="Start time (e.g. 09:00)"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-white">Time (To)</label>
          <Input
            type="time"
            name="timeTo"
            value={form.timeTo}
            onChange={handleInput}
            placeholder="End time (e.g. 17:00)"
          />
        </div>
        <div className="flex flex-col gap-2 md:col-span-2">
          <label className="text-white">Location</label>
          <Input
            name="location"
            value={form.location}
            onChange={handleInput}
            placeholder="e.g. Central Park, NY"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-white">Ticket Buy (URL)</label>
          <Input
            name="ticketUrl"
            value={form.ticketUrl}
            onChange={handleInput}
            type="url"
            placeholder="https://tickets.example.com/event"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-white">Event Info (URL)</label>
          <Input
            name="infoUrl"
            value={form.infoUrl}
            onChange={handleInput}
            type="url"
            placeholder="https://eventinfo.example.com"
          />
        </div>
        <div className="md:col-span-2 flex gap-2">
          <Button type="submit">
            {editingId ? (
              <>
                <Pencil className="mr-2 h-4 w-4" /> Update Event
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" /> Add Event
              </>
            )}
          </Button>
          {editingId && (
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setEditingId(null);
                setForm({
                  id: "",
                  img: "",
                  title: "",
                  description: "",
                  date: "",
                  category: "",
                  timeFrom: "",
                  timeTo: "",
                  location: "",
                  ticketUrl: "",
                  infoUrl: "",
                });
                setImgPreview("");
              }}
            >
              Cancel
            </Button>
          )}
        </div>
      </form>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {events.map((ev) => (
          <Card
            key={ev.id}
            className="overflow-hidden border-gray-800 bg-gray-900"
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                {ev.img && (
                  <img
                    src={
                      typeof ev.img === "string"
                        ? ev.img
                        : URL.createObjectURL(ev.img)
                    }
                    alt={ev.title}
                    className="h-12 w-20 object-cover rounded"
                  />
                )}
                <div>
                  <div className="font-semibold text-white">{ev.title}</div>
                  <div className="text-gray-400 text-xs">
                    {ev.date} | {ev.timeFrom} - {ev.timeTo}
                  </div>
                  <div className="text-gray-400 text-xs">{ev.category}</div>
                </div>
              </div>
              <div className="text-gray-400 text-sm mb-2">{ev.description}</div>
              <div className="text-gray-400 text-xs mb-2">
                Location: {ev.location}
              </div>
              <div className="flex gap-2">
                {ev.ticketUrl && (
                  <a
                    href={ev.ticketUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline text-blue-400 text-xs"
                  >
                    Buy Ticket
                  </a>
                )}
                {ev.infoUrl && (
                  <a
                    href={ev.infoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline text-green-400 text-xs"
                  >
                    Event Info
                  </a>
                )}
              </div>
              <div className="flex gap-2 mt-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleEdit(ev.id)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDelete(ev.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
