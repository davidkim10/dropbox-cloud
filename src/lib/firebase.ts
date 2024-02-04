// Import the functions you need from the SDKs you need
import { getApps, getApp, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCBJXvKTYbzJmyn142o_FCoa7OlBpFuR1M",
  authDomain: "dropbox-clone-ecaed.firebaseapp.com",
  projectId: "dropbox-clone-ecaed",
  storageBucket: "dropbox-clone-ecaed.appspot.com",
  messagingSenderId: "932840354197",
  appId: "1:932840354197:web:44c33b18b980ea95b6c69c",
};

// Initialize Firebase
const isAppInitialized = getApps().length;
const app = isAppInitialized ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };
