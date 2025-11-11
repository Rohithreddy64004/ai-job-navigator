// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDWa3R--WjdFrhAfuy50BmF40tars3qLg8",
  authDomain: "ai-job-navigator-1fed0.firebaseapp.com",
  projectId: "ai-job-navigator-1fed0",
  storageBucket: "ai-job-navigator-1fed0.firebasestorage.app",
  messagingSenderId: "518667301149",
  appId: "1:518667301149:web:514a5577f6e6c39e50b1f4",
  measurementId: "G-XFKTTJ4Q5V"
  
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup, signOut };
