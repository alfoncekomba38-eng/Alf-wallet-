import { auth, db } from "./firebase.js";
import { onAuthStateChanged } from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

let currentUser = null;

// USER LOGIN CHECK
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    document.getElementById("wallet").innerText = "Not logged in";
    document.getElementById("timer").innerText = "Login required";
    return;
  }

  currentUser = user;

  const userRef = doc(db, "users", user.uid);
  const snap = await getDoc(userRef);

  if (!snap.exists()) {
    await setDoc(userRef, {
      balance: 0,
      wallet: user.uid,
      lastMine: 0
    });
  }

  loadWallet();
});

// LOAD WALLET
async function loadWallet() {
  const userRef = doc(db, "users", currentUser.uid);
  const snap = await getDoc(userRef);
  const data = snap.data();

  document.getElementById("balance").innerText = data.balance + " ALF";
  document.getElementById("wallet").innerText = data.wallet;

  updateTimer(data.lastMine);
}

// UPDATE TIMER
function updateTimer(lastMine) {
  const cooldown = 24 * 60 * 60 * 1000;
  const now = Date.now();
  const remaining = cooldown - (now - lastMine);

  if (remaining <= 0) {
    document.getElementById("timer").innerText = "Ready to mine";
    return;
  }

  const hours = Math.floor(remaining / (1000 * 60 * 60));
  document.getElementById("timer").innerText = `Wait ${hours}h`;
}

// START MINING
window.startMining = async function () {
  if (!currentUser) return;

  const userRef = doc(db, "users", currentUser.uid);
  const snap = await getDoc(userRef);
  const data = snap.data();

  const now = Date.now();
  const cooldown = 24 * 60 * 60 * 1000;

  if (now - data.lastMine < cooldown) {
    updateTimer(data.lastMine);
    return;
  }

  await updateDoc(userRef, {
    balance: data.balance + 1,
    lastMine: now
  });

  loadWallet();
};

// COPY WALLET
window.copyWallet = function () {
  const wallet = document.getElementById("wallet").innerText;
  navigator.clipboard.writeText(wallet);
  alert("Wallet copied");
};
