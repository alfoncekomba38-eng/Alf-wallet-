// Load saved data
let balance = parseFloat(localStorage.getItem("alfBalance")) || 0;
let lastMiningTime = parseInt(localStorage.getItem("lastMiningTime")) || Date.now();

const rewardPerDay = 1;
const miningInterval = 24 * 60 * 60 * 1000; // 24 hours

function updateMining() {
    const now = Date.now();
    const elapsed = now - lastMiningTime;

    if (elapsed >= miningInterval) {
        const rewards = Math.floor(elapsed / miningInterval);
        balance += rewards * rewardPerDay;
        lastMiningTime += rewards * miningInterval;

        localStorage.setItem("alfBalance", balance);
        localStorage.setItem("lastMiningTime", lastMiningTime);
    }

    document.getElementById("walletBalance").innerText = balance.toFixed(2) + " ALF";

    const remaining = miningInterval - (now - lastMiningTime);
    const hours = Math.floor(remaining / (1000 * 60 * 60));
    const mins = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((remaining % (1000 * 60)) / 1000);

    document.getElementById("nextReward").innerText =
        `${hours}h ${mins}m ${secs}s`;
}

setInterval(updateMining, 1000);
updateMining();
