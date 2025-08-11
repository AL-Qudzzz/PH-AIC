// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBmwfDwicx8xK1wDJu2qICLQxjsD7Oal78",
  authDomain: "foresightx.firebaseapp.com",
  projectId: "foresightx",
  storageBucket: "foresightx.firebasestorage.app",
  messagingSenderId: "88174756377",
  appId: "1:88174756377:web:f6a236d9b16659fb5de088"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
