// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage, ref, uploadBytes  } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBto0fsHFZzEUBZUQ4JcMhOaKk39MUnrqw",
  authDomain: "pantry-app-95fce.firebaseapp.com",
  projectId: "pantry-app-95fce",
  storageBucket: "pantry-app-95fce.appspot.com",
  messagingSenderId: "838999789452",
  appId: "1:838999789452:web:a589a62d09e784460590a9"
};
// Initialize Firebase only if it's not already initialized
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const storage = getStorage(app);
export { firebaseConfig, firestore, storage, ref, uploadBytes  };
