let balance = parseFloat(localStorage.getItem("alfBalance")) || 0;
let lastMiningTime = parseInt(localStorage.getItem("lastMiningTime")) || 0;
let miningActive = localStorage.getItem("miningActive") === "true";

const rewardPerDay = 1;
const miningInterval = 24 * 60 * 60 * 1000;

function startMining() {
    if (!miningActive) {
        miningActive = true;
        lastMiningTime = Date.now();

        localStorage.setItem("miningActive", true);
        localStorage.setItem("lastMiningTime", lastMiningTime);

        document.getElementById("startMiningBtn").innerText = "Mining Active";
        document.getElementById("startMiningBtn").disabled = true;
    }
}

function updateMining() {
    document.getElementById("walletBalance").innerText = balance.toFixed(2) + " ALF";

    if (miningActive) {
        const now = Date.now();
        const elapsed = now - lastMiningTime;

        if (elapsed >= miningInterval) {
            balance += rewardPerDay;

            localStorage.setItem("alfBalance", balance);

            miningActive = false;
            localStorage.setItem("miningActive", false);

            document.getElementById("startMiningBtn").innerText = "Start Mining";
            document.getElementById("startMiningBtn").disabled = false;
            document.getElementById("nextReward").innerText = "Reward Ready!";
            return;
        }

        const remaining = miningInterval - elapsed;
        const hours = Math.floor(remaining / (1000 * 60 * 60));
        const mins = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((remaining % (1000 * 60)) / 1000);

        document.getElementById("nextReward").innerText =
            `${hours}h ${mins}m ${secs}s`;

        document.getElementById("startMiningBtn").innerText = "Mining Active";
        document.getElementById("startMiningBtn").disabled = true;
    } else {
        document.getElementById("nextReward").innerText = "Press Start Mining";
        document.getElementById("startMiningBtn").innerText = "Start Mining";
        document.getElementById("startMiningBtn").disabled = false;
    }
}

setInterval(updateMining, 1000);
updateMining();
