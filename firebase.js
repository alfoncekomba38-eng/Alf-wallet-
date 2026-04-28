import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
  getAuth,
  signInAnonymously
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCBycKh2s1Z0CDdPaMhaYUcryc0jMuCo2U",
  authDomain: "alf-wallet.firebaseapp.com",
  projectId: "alf-wallet",
  storageBucket: "alf-wallet.firebasestorage.app",
  messagingSenderId: "451766153657",
  appId: "1:451766153657:web:6276c12f129f3b890f0668"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

export function login() {
  return signInAnonymously(auth);
}
