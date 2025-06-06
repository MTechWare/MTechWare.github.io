// firebase.js
// IMPORTANT: Replace the config object below with your real Firebase config from the Firebase Console.
// Never expose this file publicly if it contains your real credentials.

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { getDatabase, ref, set, get, child } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyDNYPlelyT-VXDPcwnHQYdDXqk4q9wGXFA",
  authDomain: "mlogin-26fbb.firebaseapp.com",
  databaseURL: "https://mlogin-26fbb-default-rtdb.firebaseio.com",
  projectId: "mlogin-26fbb",
  storageBucket: "mlogin-26fbb.firebasestorage.app",
  messagingSenderId: "55394975104",
  appId: "1:55394975104:web:44f177dc6961ca00cc5565"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Initialize Realtime Database
const db = getDatabase(app);

export { auth, db, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, signOut, onAuthStateChanged, set, ref, get, child };
