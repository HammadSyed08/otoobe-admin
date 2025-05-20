// lib/firebaseAdmin.js
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

// Ensure this only initializes once
const secondaryApp =
  getApps().find((app) => app.name === "Secondary") ||
  initializeApp(
    {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    },
    "Secondary"
  );

const secondaryAuth = getAuth(secondaryApp);

export default secondaryAuth;
