import { db, storage } from '../../lib/firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { categories } from '../../data/categories.json';

interface Event {
  id?: string;
  title: string;
  description: string;
  date: string;
  category: string;
  subCategory: string;
  timeFrom: string;
  timeTo: string;
  location: string;
  ticketUrl: string;
  infoUrl: string;
  imageUrl: string;
}

export const eventService = {
  // Upload image to Firebase Storage
  async uploadImage(file: File): Promise<string> {
    const storageRef = ref(storage, `events/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  },

  // Delete image from Firebase Storage
  async deleteImage(imageUrl: string) {
    const imageRef = ref(storage, imageUrl);
    await deleteObject(imageRef);
  },


  async createEvent(eventData: Event, imageFile: File | null): Promise<string> {
    try {
      let imageUrl = '';
      if (imageFile) {
        imageUrl = await this.uploadImage(imageFile);
      }

      const eventRef = await addDoc(collection(db, 'Events'), {
        ...eventData,
        images: [imageUrl],
        createdAt: new Date().toISOString(),
      });

      return eventRef.id;
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    }
  },

  // Update existing event
  async updateEvent(id: string, eventData: Partial<Event>, imageFile: File | null): Promise<void> {
    try {
      const eventRef = doc(db, 'Events', id);
      let updateData = { ...eventData };

      if (imageFile) {
        // Delete old image if exists
        if (eventData.imageUrl) {
          await this.deleteImage(eventData.imageUrl);
        }
        // Upload new image
        const imageUrl = await this.uploadImage(imageFile);
        updateData.imageUrl = imageUrl;
      }

      await updateDoc(eventRef, updateData);
    } catch (error) {
      console.error('Error updating event:', error);
      throw error;
    }
  },

  // Delete event
  async deleteEvent(id: string, imageUrl: string | null): Promise<void> {
    try {
      if (imageUrl) {
        await this.deleteImage(imageUrl);
      }
      await deleteDoc(doc(db, 'Events', id));
    } catch (error) {
      console.error('Error deleting event:', error);
      throw error;
    }
  },

  // Get all events
  async getEvents(): Promise<Event[]> {
    try {
      const querySnapshot = await getDocs(collection(db, 'Events'));
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Event));
    } catch (error) {
      console.error('Error getting events:', error);
      throw error;
    }
  },


};