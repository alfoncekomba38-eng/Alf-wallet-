function getTime() {
    return new Date().getTime();
}

// initialize user mining data
function initMining() {
    if (!localStorage.getItem("alf_balance")) {
        localStorage.setItem("alf_balance", "0");
    }

    if (!localStorage.getItem("last_mine")) {
        localStorage.setItem("last_mine", getTime());
    }
}

// mining engine
function miningEngine() {
    let lastMine = parseInt(localStorage.getItem("last_mine"));
    let now = getTime();

    let diff = now - lastMine;

    // 24 hours = 86400000 ms
    if (diff >= 86400000) {

        let balance = parseFloat(localStorage.getItem("alf_balance"));

        balance += 1; // reward

        localStorage.setItem("alf_balance", balance);
        localStorage.setItem("last_mine", now);

        console.log("Mining reward added +1 ALF");
    }

    updateUI();
}

// update UI
function updateUI() {
    let bal = localStorage.getItem("alf_balance") || 0;
    document.getElementById("balance").innerText = bal + " ALF";

    let last = parseInt(localStorage.getItem("last_mine"));
    let now = getTime();

    let remaining = 86400000 - (now - last);

    if (remaining < 0) remaining = 0;

    let hours = Math.floor(remaining / 3600000);
    let minutes = Math.floor((remaining % 3600000) / 60000);

    document.getElementById("mineTimer").innerText =
        hours + "h " + minutes + "m";
}

// start system
initMining();
setInterval(miningEngine, 60000); // check kila dakika
updateUI();
