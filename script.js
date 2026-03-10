// EmailJS init
emailjs.init({
    publicKey: "nudWwnYWHTCO1PI2C"
});

// Open/close window
function openWindow(windowId) {
    document.getElementById(windowId).style.display = "block";
}

function closeWindow(windowId) {
    document.getElementById(windowId).style.display = "none";
}

// Clock
function updateClock() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, "0");
    document.getElementById("clock").textContent = `${hours}:${minutes}`;
}

setInterval(updateClock, 1000);
updateClock();

// Windows-style alert
function showAlert(message) {
    document.getElementById("alertMessage").textContent = message;
    document.getElementById("winAlert").style.display = "flex";
}

function closeAlert() {
    document.getElementById("winAlert").style.display = "none";
}

// Copy email
function copyEmail() {
    const email = "mlabarang04@gmail.com";

    navigator.clipboard.writeText(email).then(() => {
        showAlert("Email copied to clipboard.");
    }).catch(() => {
        showAlert("Could not copy email.");
    });
}

// Send form with EmailJS
document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("contactForm");

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        emailjs.sendForm(
            "service_gvumrnh",
            "template_ig3uupv",
            "#contactForm"
        )
        .then(function () {
            showAlert("Your message has been sent successfully.");
            form.reset();
        })
        .catch(function (error) {
            console.error("EmailJS error:", error);
            showAlert("Message failed to send. Please try again.");
        });
    });
});
