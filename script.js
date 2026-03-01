// Open popup window
function openWindow() {
    document.getElementById("popupWindow").style.display = "block";
}

// Close popup window
function closeWindow() {
    document.getElementById("popupWindow").style.display = "none";
}

// Clock
function updateClock() {
    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes().toString().padStart(2, "0");
    document.getElementById("clock").textContent = `${hours}:${minutes}`;
}

setInterval(updateClock, 1000);
updateClock();