import { auth, db } from "./firebase.js";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

let currentUser = null;

auth.onAuthStateChanged(async (user) => {
  if (!user) return;

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

async function loadWallet() {
  const userRef = doc(db, "users", currentUser.uid);
  const snap = await getDoc(userRef);
  const data = snap.data();

  document.getElementById("balance").innerText = data.balance + " ALF";
  document.getElementById("wallet").innerText = data.wallet;

  updateTimer(data.lastMine);
}

function updateTimer(lastMine) {
  const now = Date.now();
  const cooldown = 24 * 60 * 60 * 1000;
  const diff = cooldown - (now - lastMine);

  if (diff <= 0) {
    document.getElementById("timer").innerText = "Ready to mine";
    return;
  }

  const hrs = Math.floor(diff / (1000 * 60 * 60));
  const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  document.getElementById("timer").innerText = `${hrs}h ${mins}m left`;
}

window.startMining = async function () {
  const userRef = doc(db, "users", currentUser.uid);
  const snap = await getDoc(userRef);
  const data = snap.data();

  const now = Date.now();
  const cooldown = 24 * 60 * 60 * 1000;

  if (now - data.lastMine < cooldown) {
    alert("Mining not ready yet");
    return;
  }

  await updateDoc(userRef, {
    balance: data.balance + 1,
    lastMine: now
  });

  loadWallet();
};

window.copyWallet = async function () {
  const wallet = document.getElementById("wallet").innerText;
  await navigator.clipboard.writeText(wallet);
  alert("Wallet copied");
};
