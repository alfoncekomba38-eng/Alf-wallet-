import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// 🔥 YOUR FIREBASE CONFIG (weka real values zako hapa)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "alf-wallet.firebaseapp.com",
  projectId: "alf-wallet",
  storageBucket: "alf-wallet.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Auth
const auth = getAuth(app);

// Firestore
const db = getFirestore(app);

// 🔥 AUTO SIGN-IN (Anonymous user)
signInAnonymously(auth)
  .then(() => {
    console.log("User signed in anonymously ✔");
  })
  .catch((error) => {
    console.error("Auth error:", error);
  });

// 🔥 LISTEN USER STATE
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("User ready:", user.uid);
    localStorage.setItem("alf_user", user.uid);
  } else {
    console.log("No user logged in");
  }
});

export { auth, db };
