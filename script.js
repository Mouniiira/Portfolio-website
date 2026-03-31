// =========================
// EmailJS
// =========================
emailjs.init({
    publicKey: "nudWwnYWHTCO1PI2C"
});

// =========================
// Z-index management
// =========================
let topZIndex = 300;

function bringToFront(element) {
    topZIndex += 1;
    element.style.zIndex = topZIndex;
}

// =========================
// Window controls
// =========================
function openWindow(windowId) {
    const win = document.getElementById(windowId);
    if (!win) return;

    win.style.display = "block";
    bringToFront(win);
}

function closeWindow(windowId) {
    const win = document.getElementById(windowId);
    if (!win) return;

    win.style.display = "none";
}

// =========================
// Clock
// =========================
function updateClock() {
    const clock = document.getElementById("clock");
    if (!clock) return;

    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, "0");
    clock.textContent = `${hours}:${minutes}`;
}

// =========================
// Windows-style alert
// =========================
function showAlert(message) {
    const alertMessage = document.getElementById("alertMessage");
    const alertBox = document.getElementById("winAlert");

    if (!alertMessage || !alertBox) return;

    alertMessage.textContent = message;
    alertBox.style.display = "flex";
}

function closeAlert() {
    const alertBox = document.getElementById("winAlert");
    if (!alertBox) return;

    alertBox.style.display = "none";
}

// =========================
// Copy email
// =========================
function copyEmail() {
    const email = "mlabarang04@gmail.com";

    navigator.clipboard.writeText(email)
        .then(() => {
            showAlert("Email copied to clipboard.");
        })
        .catch(() => {
            showAlert("Could not copy email.");
        });
}

// =========================
// Drag helpers
// =========================
function clamp(value, min, max) {
    return Math.max(min, Math.min(value, max));
}

function makeWindowDraggable(windowEl, handleEl) {
    if (!windowEl || !handleEl) return;

    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;

    handleEl.addEventListener("mousedown", function (event) {
        if (event.target.closest("button")) return;

        isDragging = true;
        bringToFront(windowEl);

        const rect = windowEl.getBoundingClientRect();
        offsetX = event.clientX - rect.left;
        offsetY = event.clientY - rect.top;

        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);

        event.preventDefault();
    });

    function onMouseMove(event) {
        if (!isDragging) return;

        const maxLeft = window.innerWidth - windowEl.offsetWidth;
        const maxTop = window.innerHeight - windowEl.offsetHeight - 40;

        const left = clamp(event.clientX - offsetX, 0, maxLeft);
        const top = clamp(event.clientY - offsetY, 0, maxTop);

        windowEl.style.left = `${left}px`;
        windowEl.style.top = `${top}px`;
    }

    function onMouseUp() {
        isDragging = false;
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
    }
}

function makeIconDraggable(iconEl) {
    if (!iconEl) return;

    let isDragging = false;
    let hasMoved = false;
    let offsetX = 0;
    let offsetY = 0;

    iconEl.addEventListener("mousedown", function (event) {
        if (event.button !== 0) return;

        isDragging = true;
        hasMoved = false;

        const rect = iconEl.getBoundingClientRect();
        offsetX = event.clientX - rect.left;
        offsetY = event.clientY - rect.top;

        bringToFront(iconEl);
        selectIcon(iconEl);

        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);

        event.preventDefault();
    });

    function onMouseMove(event) {
        if (!isDragging) return;

        const nextLeft = event.clientX - offsetX;
        const nextTop = event.clientY - offsetY;

        const maxLeft = window.innerWidth - iconEl.offsetWidth;
        const maxTop = window.innerHeight - iconEl.offsetHeight - 40;

        const left = clamp(nextLeft, 0, maxLeft);
        const top = clamp(nextTop, 0, maxTop);

        iconEl.style.left = `${left}px`;
        iconEl.style.top = `${top}px`;

        hasMoved = true;
    }

    function onMouseUp() {
        isDragging = false;
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);

        // reset move flag after click cycle finishes
        setTimeout(() => {
            hasMoved = false;
        }, 0);
    }

    iconEl.addEventListener("click", function (event) {
        selectIcon(iconEl);

        if (hasMoved) {
            event.preventDefault();
            event.stopPropagation();
        }
    });
}

// =========================
// Desktop icon selection
// =========================
function clearIconSelection() {
    document.querySelectorAll(".icon").forEach((icon) => {
        icon.classList.remove("selected");
    });
}

function selectIcon(iconEl) {
    clearIconSelection();
    iconEl.classList.add("selected");
}

// =========================
// Setup
// =========================
document.addEventListener("DOMContentLoaded", function () {
    // Clock
    updateClock();
    setInterval(updateClock, 1000);

    // Contact form
    const form = document.getElementById("contactForm");
    if (form) {
        form.addEventListener("submit", function (event) {
            event.preventDefault();

            document.body.classList.add("waiting");

            emailjs.sendForm(
                "service_gvumrnh",
                "template_ig3uupv",
                "#contactForm"
            )
            .then(function () {
                document.body.classList.remove("waiting");
                showAlert("Your message has been sent successfully.");
                form.reset();
            })
            .catch(function (error) {
                document.body.classList.remove("waiting");
                console.error("EmailJS error:", error);
                showAlert("Message failed to send. Please try again.");
            });
        });
    }

    // Draggable windows
    document.querySelectorAll(".window").forEach((windowEl) => {
        const titleBar = windowEl.querySelector(".title-bar");
        if (titleBar) {
            makeWindowDraggable(windowEl, titleBar);
        }

        windowEl.addEventListener("mousedown", function () {
            bringToFront(windowEl);
        });
    });

    // Draggable desktop icons
    document.querySelectorAll(".icon").forEach((iconEl) => {
        makeIconDraggable(iconEl);
    });

    // Clicking empty desktop clears icon selection
    const desktop = document.querySelector(".desktop");
    if (desktop) {
        desktop.addEventListener("click", function (event) {
            if (event.target === desktop) {
                clearIconSelection();
            }
        });
    }

    // Prevent alert clicks from closing through overlay accidentally
    const alertBox = document.querySelector(".alert-box");
    if (alertBox) {
        alertBox.addEventListener("mousedown", function (event) {
            event.stopPropagation();
        });
    }
});
