import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getAuth,
  GoogleAuthProvider,
  signInWithRedirect,
  getRedirectResult,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  getFirestore,
  doc,
  setDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// ========================
// FIREBASE CONFIG
// ========================
const firebaseConfig = {
  apiKey: "AIzaSyCBycKh2s1Z0CDdPaMhaYUcryc0jMuCo2U",
  authDomain: "alf-wallet.firebaseapp.com",
  projectId: "alf-wallet",
  storageBucket: "alf-wallet.firebasestorage.app",
  messagingSenderId: "451766153657",
  appId: "1:451766153657:web:6276c12f129f3b890f0668"
};

// INIT
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ========================
// LOGIN FUNCTION
// ========================
window.loginWithGoogle = function () {
  const provider = new GoogleAuthProvider();
  signInWithRedirect(auth, provider);
};

// ========================
// HANDLE REDIRECT LOGIN
// ========================
getRedirectResult(auth)
  .then(async (result) => {
    if (result && result.user) {
      const user = result.user;

      console.log("Login success:", user.email);

      // Save user to Firestore
      await createUserIfNotExists(user);
    }
  })
  .catch((error) => {
    console.error("Login error:", error);
  });

// ========================
// AUTH STATE (GLOBAL USER)
// ========================
onAuthStateChanged(auth, async (user) => {
  if (user) {
    window.currentUser = user;

    console.log("User active:", user.email);

    // ensure user exists in DB
    await createUserIfNotExists(user);

  } else {
    window.currentUser = null;
    console.log("No user logged in");
  }
});

// ========================
// CREATE USER IN FIRESTORE
// ========================
async function createUserIfNotExists(user) {
  const userRef = doc(db, "users", user.uid);
  const snap = await getDoc(userRef);

  if (!snap.exists()) {
    await setDoc(userRef, {
      uid: user.uid,
      name: user.displayName,
      email: user.email,
      photo: user.photoURL || null,
      wallet: null,
      referralCode: user.uid.slice(0, 8),
      createdAt: Date.now(),
      rewards: 0
    });

    console.log("New user created in Firestore");
  }
}

// ========================
// GET CURRENT USER DATA
// ========================
window.getUserData = async function () {
  if (!window.currentUser) return null;

  const ref = doc(db, "users", window.currentUser.uid);
  const snap = await getDoc(ref);

  if (snap.exists()) {
    return snap.data();
  }

  return null;
};

// EXPORTS
export { auth, db };
