import { db, auth, login } from "./firebase.js";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const miningTime = 24 * 60 * 60 * 1000;

let ref;
let uid;

// LOGIN USER
login();

// AUTH STATE
onAuthStateChanged(auth, async (user) => {
  if (!user) return;

  uid = user.uid;
  ref = doc(db, "miners", uid);

  const snap = await getDoc(ref);

  if (!snap.exists()) {
    await setDoc(ref, {
      balance: 0,
      mining: false,
      last: 0,
      wallet: "ALF-" + uid.substring(0, 8)
    });
  }

  startLoop();
});

// COPY
window.copyWallet = function () {
  navigator.clipboard.writeText("ALF WALLET");
  alert("Copied!");
};

// START MINING
window.startMining = async function () {
  if (!ref) return;

  await setDoc(ref, {
    mining: true,
    last: Date.now()
  }, { merge: true });
};

// LOOP (safe)
function startLoop() {
  setInterval(async () => {
    if (!ref) return;

    const snap = await getDoc(ref);
    if (!snap.exists()) return;

    const d = snap.data();

    document.getElementById("balance").innerText = d.balance + " ALF";
    document.getElementById("wallet").innerText = d.wallet;

    if (d.mining) {
      const diff = Date.now() - d.last;

      if (diff >= miningTime) {
        await updateDoc(ref, {
          balance: d.balance + 1,
          mining: false
        });

        document.getElementById("timer").innerText = "Reward Added!";
      } else {
        const r = miningTime - diff;
        const h = Math.floor(r / 3600000);
        const m = Math.floor((r % 3600000) / 60000);
        const s = Math.floor((r % 60000) / 1000);

        document.getElementById("timer").innerText =
          `${h}h ${m}m ${s}s`;
      }
    } else {
      document.getElementById("timer").innerText = "Press Start Mining";
    }
  }, 5000);
}
