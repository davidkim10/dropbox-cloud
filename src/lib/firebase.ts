import { getApps, getApp, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "dropbox-clone-ecaed.firebaseapp.com",
  projectId: "dropbox-clone-ecaed",
  storageBucket: "dropbox-clone-ecaed.appspot.com",
  messagingSenderId: "932840354197",
  appId: "1:932840354197:web:44c33b18b980ea95b6c69c",
};

const isAppInitialized = getApps().length;
const app = isAppInitialized ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };
