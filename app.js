import { auth, db } from "./firebase.js";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

let currentUser = null;

/* 🔐 AUTH CHECK */
auth.onAuthStateChanged(async (user) => {
  if (!user) return;

  currentUser = user;

  const userRef = doc(db, "users", user.uid);
  const snap = await getDoc(userRef);

  if (!snap.exists()) {
    const myRefCode = "ALF" + Math.floor(Math.random() * 1000000);

    await setDoc(userRef, {
      balance: 0,
      wallet: user.uid,
      lastMine: 0,
      refCode: myRefCode,
      referredBy: "",
      referrals: 0
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

  if (document.getElementById("refCode")) {
    document.getElementById("refCode").innerText = data.refCode;
  }

  updateTimer(data.lastMine);
}

/* ⏳ TIMER */
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

/* ⛏️ START MINING */
window.startMining = async function () {
  if (!currentUser) {
    alert("Login first");
    return;
  }

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

/* 🎁 USE REFERRAL CODE */
window.useReferralCode = async function () {
  if (!currentUser) {
    alert("Login first");
    return;
  }

  const code = prompt("Enter referral code");
  if (!code) return;

  const myRef = doc(db, "users", currentUser.uid);
  const mySnap = await getDoc(myRef);
  const myData = mySnap.data();

  if (myData.referredBy && myData.referredBy !== "") {
    alert("Referral already used");
    return;
  }

  const usersRef = collection(db, "users");
  const q = query(usersRef, where("refCode", "==", code));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    alert("Invalid referral code");
    return;
  }

  const ownerDoc = querySnapshot.docs[0];
  const ownerRef = doc(db, "users", ownerDoc.id);
  const ownerData = ownerDoc.data();

  await updateDoc(ownerRef, {
    balance: ownerData.balance + 5,
    referrals: ownerData.referrals + 1
  });

  await updateDoc(myRef, {
    referredBy: code
  });

  alert("Referral bonus applied ✔");
};
