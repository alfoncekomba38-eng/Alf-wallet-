import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// 🔥 YOUR REAL CONFIG (from Firebase)
const firebaseConfig = {
  apiKey: "AIzaSyCBycKh2s1Z0CDdPaMhaYUcryc0jMuCo2U",
  authDomain: "alf-wallet.firebaseapp.com",
  databaseURL: "https://alf-wallet-default-rtdb.firebaseio.com",
  projectId: "alf-wallet",
  storageBucket: "alf-wallet.firebasestorage.app",
  messagingSenderId: "451766153657",
  appId: "1:451766153657:web:6276c12f129f3b890f0668",
  measurementId: "G-H4GKSK1CZT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Auth
const auth = getAuth(app);

// Firestore
const db = getFirestore(app);

// 🔥 AUTO LOGIN
signInAnonymously(auth)
  .then(() => {
    console.log("Anonymous login success ✔");
  })
  .catch((error) => {
    console.error("Auth error:", error);
  });

// 🔥 USER STATE LISTENER
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("User UID:", user.uid);
    localStorage.setItem("alf_uid", user.uid);
  } else {
    console.log("No user logged in");
  }
});

export { auth, db };
