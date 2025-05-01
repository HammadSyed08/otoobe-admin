import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  DocumentData,
  QueryDocumentSnapshot,
} from "firebase/firestore";

interface User {
  id: string;
  email: string;
  fullName?: string;
  location?: Array<any>;
  createdAt?: string;
  updatedAt?: string;
}

const USERS_COLLECTION = "Users";

export const getAllUsers = async (): Promise<User[]> => {
  try {
    const usersCollection = collection(db, USERS_COLLECTION);
    const querySnapshot = await getDocs(usersCollection);
    return querySnapshot.docs.map(
      (doc: QueryDocumentSnapshot<DocumentData>) => ({
        id: doc.id,
        ...doc.data(),
      })
    ) as User[];
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const getUserById = async (userId: string): Promise<User | null> => {
  try {
    const userDoc = doc(db, USERS_COLLECTION, userId);
    const userSnapshot = await getDoc(userDoc);
    if (!userSnapshot.exists()) return null;
    return { id: userSnapshot.id, ...userSnapshot.data() } as User;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};

export const updateUser = async (
  userId: string,
  userData: Partial<User>
): Promise<void> => {
  try {
    const userDoc = doc(db, USERS_COLLECTION, userId);
    await updateDoc(userDoc, {
      ...userData,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

export const deleteUser = async (userId: string): Promise<void> => {
  try {
    const userDoc = doc(db, USERS_COLLECTION, userId);
    await deleteDoc(userDoc);
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};
