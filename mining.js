import { db } from "./firebase.js";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const wallet = "ALF-3TY0YDYQAZEJP92G";
const rewardPerDay = 1;
const miningInterval = 24 * 60 * 60 * 1000;

async function loadMining() {
  const ref = doc(db, "miners", wallet);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    await setDoc(ref, {
      balance: 0,
      lastMining: Date.now(),
      miningActive: false
    });
  }

  updateMining();
}

async function startMining() {
  const ref = doc(db, "miners", wallet);

  await updateDoc(ref, {
    miningActive: true,
    lastMining: Date.now()
  });

  updateMining();
}

async function updateMining() {
  const ref = doc(db, "miners", wallet);
  const snap = await getDoc(ref);

  const data = snap.data();

  document.getElementById("walletBalance").innerText =
    data.balance.toFixed(2) + " ALF";

  if (data.miningActive) {
    const now = Date.now();
    const elapsed = now - data.lastMining;

    if (elapsed >= miningInterval) {
      await updateDoc(ref, {
        balance: data.balance + rewardPerDay,
        miningActive: false
      });

      document.getElementById("nextReward").innerText = "Reward Added!";
      return;
    }

    const remaining = miningInterval - elapsed;
    const h = Math.floor(remaining / (1000 * 60 * 60));
    const m = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((remaining % (1000 * 60)) / 1000);

    document.getElementById("nextReward").innerText = `${h}h ${m}m ${s}s`;
  }
}

window.startMining = startMining;
loadMining();
setInterval(updateMining, 1000);
