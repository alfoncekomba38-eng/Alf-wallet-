import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCBycKh2s1Z0CDdPaMhaYUcryc0jMuCo2U",
  authDomain: "alf-wallet.firebaseapp.com",
  projectId: "alf-wallet",
  storageBucket: "alf-wallet.firebasestorage.app",
  messagingSenderId: "451766153657",
  appId: "1:451766153657:web:6276c12f129f3b890f0668"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

signInAnonymously(auth)
  .then(() => console.log("Anonymous login success"))
  .catch((error) => console.error(error));

export { auth, db };
