import { auth, db } from "./firebase.js";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

let currentUser = null;

/* 🔐 AUTH CHECK */
auth.onAuthStateChanged(async (user) => {
  if (!user) return;

  currentUser = user;

  const userRef = doc(db, "users", user.uid);
  const snap = await getDoc(userRef);

  // 🧠 create user ikiwa haipo
  if (!snap.exists()) {
    await setDoc(userRef, {
      balance: 0,
      wallet: user.uid,
      lastMine: 0
    });
  }

  loadWallet();
});

/* 📊 LOAD WALLET */
async function loadWallet() {
  if (!currentUser) return;

  const userRef = doc(db, "users", currentUser.uid);
  const snap = await getDoc(userRef);

  if (!snap.exists()) return;

  const data = snap.data();

  document.getElementById("balance").innerText = data.balance + " ALF";
  document.getElementById("wallet").innerText = data.wallet;

  updateTimer(data.lastMine);
}

/* ⏳ MINING TIMER */
function updateTimer(lastMine = 0) {
  const now = Date.now();
  const cooldown = 24 * 60 * 60 * 1000;
  const diff = cooldown - (now - lastMine);

  if (diff <= 0) {
    document.getElementById("timer").innerText = "Ready to mine ⛏️";
    return;
  }

  const hrs = Math.floor(diff / (1000 * 60 * 60));
  const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  document.getElementById("timer").innerText =
    `${hrs}h ${mins}m left`;
}

/* ⛏️ MINING */
window.startMining = async function () {
  if (!currentUser) return;

  const userRef = doc(db, "users", currentUser.uid);
  const snap = await getDoc(userRef);

  if (!snap.exists()) return;

  const data = snap.data();

  const now = Date.now();
  const cooldown = 24 * 60 * 60 * 1000;

  if (now - data.lastMine < cooldown) {
    alert("⏳ Subiri masaa 24 kwanza");
    return;
  }

  await updateDoc(userRef, {
    balance: data.balance + 1,
    lastMine: now
  });

  loadWallet();
};

/* 📋 COPY WALLET */
window.copyWallet = async function () {
  const wallet = document.getElementById("wallet").innerText;
  await navigator.clipboard.writeText(wallet);
  alert("Copied ✔");
};
