import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  // your config hapa
};

const app = initializeApp(firebaseConfig);

// AUTH
const auth = getAuth(app);

// AUTO LOGIN (IMPORTANT)
signInAnonymously(auth)
  .then(() => {
    console.log("User signed in anonymously ✔");
  })
  .catch((error) => {
    console.error("Auth error:", error);
  });

// FIRESTORE
const db = getFirestore(app);

export { auth, db };
