emailjs.init({
    publicKey: "nudWwnYWHTCO1PI2C"
});

let topZIndex = 300;

const playlist = [
    {
        title: "The boy is mine - Brandy, Monica",
        src: "music/boyismine.mp3"
    },
    {
        title: "My way - USHER",
        src: "music/myway.mp3"
    },
    {
        title: "No, No, No Pt. 2 - Destiny's Child ft. Wyclef Jean",
        src: "music/nonono.mp3"
    },
    {
        title: "Gettin' Jiggy Wit It - Will Smith",
        src: "music/jiggy.mp3"
    },
    {
        title: "Everybody (Backstreet's Back) - Backstreet Boys",
        src: "music/everybody.mp3"
    },
    {
        title: "You make me wanna - USHER",
        src: "music/makemewanna.mp3"
    },
    {
        title: "I want you back - NSYNC",
        src: "music/wantyouback.mp3"
    },
    {
        title: "I get lonely - Janet Jackson",
        src: "music/lonely.mp3"
    },
    {
        title: "Dangerous - Busta Rhymes",
        src: "music/dangerous.mp3"
    },
    {
        title: "Doo Wop - Lauryn Hill",
        src: "music/doowop.mp3"
    }
];

let currentTrackIndex = 0;

const originalPositions = {
    icons: {
        About: { top: "20px", left: "20px" },
        Projects: { top: "140px", left: "20px" },
        Games: { top: "260px", left: "20px" },
        "Contact me": { top: "380px", left: "20px" }
    },
    windows: {
        AboutWindow: { top: "110px", left: "220px" },
        ProjectsWindow: { top: "110px", left: "220px" },
        GamesWindow: { top: "110px", left: "220px" },
        ContactWindow: { top: "110px", left: "220px" },
        MusicWindow: { top: "110px", left: "220px" },
        HelpWindow: { top: "110px", left: "220px" }
    }
};

function bringToFront(element) {
    topZIndex += 1;
    element.style.zIndex = topZIndex;
}

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

function updateClock() {
    const clock = document.getElementById("clock");
    if (!clock) return;

    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, "0");
    clock.textContent = `${hours}:${minutes}`;
}

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

function formatSeconds(seconds) {
    if (!Number.isFinite(seconds)) return "0.00 sec.";
    return `${seconds.toFixed(2)} sec.`;
}

function updateMusicUI() {
    const player = document.getElementById("musicPlayer");
    const currentTimeDisplay = document.getElementById("currentTimeDisplay");
    const durationDisplay = document.getElementById("durationDisplay");
    const seekBar = document.getElementById("seekBar");
    const soundWave = document.getElementById("soundWave");

    if (!player) return;

    if (currentTimeDisplay) {
        currentTimeDisplay.textContent = formatSeconds(player.currentTime || 0);
    }

    if (durationDisplay) {
        durationDisplay.textContent = formatSeconds(player.duration || 0);
    }

    if (seekBar) {
        const percent = player.duration ? (player.currentTime / player.duration) * 100 : 0;
        seekBar.value = percent;
    }

    if (soundWave) {
        const offset = player.currentTime ? (player.currentTime * 40) % 200 : 0;
        soundWave.style.transform = `translateY(-50%) translateX(-${offset}px)`;
    }
}

function loadTrack(index) {
    const player = document.getElementById("musicPlayer");
    const label = document.getElementById("nowPlayingLabel");
    const playPauseBtn = document.getElementById("playPauseBtn");

    if (!player || !label || !playlist.length) return;

    currentTrackIndex = (index + playlist.length) % playlist.length;

    player.src = playlist[currentTrackIndex].src;
    label.textContent = playlist[currentTrackIndex].title;
    player.load();

    if (playPauseBtn) {
        playPauseBtn.textContent = "▶";
    }

    updateMusicUI();
}

function nextTrack() {
    loadTrack(currentTrackIndex + 1);
}

function previousTrack() {
    loadTrack(currentTrackIndex - 1);
}

function playPauseTrack() {
    const player = document.getElementById("musicPlayer");
    const playPauseBtn = document.getElementById("playPauseBtn");

    if (!player || !playPauseBtn) return;

    if (player.paused) {
        player.play();
        playPauseBtn.textContent = "❚❚";
    } else {
        player.pause();
        playPauseBtn.textContent = "▶";
    }
}

function stopTrack() {
    const player = document.getElementById("musicPlayer");
    const playPauseBtn = document.getElementById("playPauseBtn");

    if (!player || !playPauseBtn) return;

    player.pause();
    player.currentTime = 0;
    playPauseBtn.textContent = "▶";
    updateMusicUI();
}

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

        setTimeout(() => {
            hasMoved = false;
        }, 0);
    }

    iconEl.addEventListener("dblclick", function () {
        const windowId = iconEl.dataset.window;
        if (windowId) openWindow(windowId);
    });

    iconEl.addEventListener("click", function (event) {
        selectIcon(iconEl);

        if (hasMoved) {
            event.preventDefault();
            event.stopPropagation();
        }
    });
}

function clearIconSelection() {
    document.querySelectorAll(".icon").forEach((icon) => {
        icon.classList.remove("selected");
    });
}

function selectIcon(iconEl) {
    clearIconSelection();
    iconEl.classList.add("selected");
}

function toggleStartMenu() {
    const startMenu = document.getElementById("startMenu");
    if (!startMenu) return;

    startMenu.classList.toggle("open");
}

function closeStartMenu() {
    const startMenu = document.getElementById("startMenu");
    if (!startMenu) return;

    startMenu.classList.remove("open");
}

function refreshDesktop() {
    const icons = document.querySelectorAll(".icon");

    icons.forEach((icon) => {
        const label = icon.querySelector("span")?.textContent?.trim();
        if (label && originalPositions.icons[label]) {
            icon.style.top = originalPositions.icons[label].top;
            icon.style.left = originalPositions.icons[label].left;
        }
    });

    Object.entries(originalPositions.windows).forEach(([id, pos]) => {
        const win = document.getElementById(id);
        if (!win) return;

        win.style.top = pos.top;
        win.style.left = pos.left;
        win.style.display = "none";
    });

    const musicPlayer = document.getElementById("musicPlayer");
    const playPauseBtn = document.getElementById("playPauseBtn");

    if (musicPlayer) {
        musicPlayer.pause();
        musicPlayer.currentTime = 0;
    }

    if (playPauseBtn) {
        playPauseBtn.textContent = "▶";
    }

    loadTrack(0);
    closeAlert();
    closeStartMenu();
    clearIconSelection();
}

document.addEventListener("DOMContentLoaded", function () {
    updateClock();
    setInterval(updateClock, 1000);

    loadTrack(currentTrackIndex);

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

    document.querySelectorAll(".window").forEach((windowEl) => {
        const titleBar = windowEl.querySelector(".title-bar");
        if (titleBar) {
            makeWindowDraggable(windowEl, titleBar);
        }

        windowEl.addEventListener("mousedown", function () {
            bringToFront(windowEl);
        });
    });

    document.querySelectorAll(".icon").forEach((iconEl) => {
        makeIconDraggable(iconEl);
    });

    document.querySelectorAll("[data-close]").forEach((btn) => {
        btn.addEventListener("click", function () {
            const windowId = btn.dataset.close;
            if (windowId) closeWindow(windowId);
        });
    });

    const alertOkBtn = document.getElementById("alertOkBtn");
    if (alertOkBtn) {
        alertOkBtn.addEventListener("click", closeAlert);
    }

    const copyEmailBtn = document.getElementById("copyEmailBtn");
    if (copyEmailBtn) {
        copyEmailBtn.addEventListener("click", copyEmail);
    }

    const prevTrackBtn = document.getElementById("prevTrackBtn");
    if (prevTrackBtn) {
        prevTrackBtn.addEventListener("click", previousTrack);
    }

    const nextTrackBtn = document.getElementById("nextTrackBtn");
    if (nextTrackBtn) {
        nextTrackBtn.addEventListener("click", nextTrack);
    }

    const playPauseBtn = document.getElementById("playPauseBtn");
    if (playPauseBtn) {
        playPauseBtn.addEventListener("click", playPauseTrack);
    }

    const stopTrackBtn = document.getElementById("stopTrackBtn");
    if (stopTrackBtn) {
        stopTrackBtn.addEventListener("click", stopTrack);
    }

    const recordFakeBtn = document.getElementById("recordFakeBtn");
    if (recordFakeBtn) {
        recordFakeBtn.addEventListener("click", function () {
            showAlert("Recording is not available.");
        });
    }

    const seekBar = document.getElementById("seekBar");
    if (seekBar) {
        seekBar.addEventListener("input", function () {
            const player = document.getElementById("musicPlayer");
            if (!player || !player.duration) return;

            player.currentTime = (seekBar.value / 100) * player.duration;
            updateMusicUI();
        });
    }

    const musicPlayer = document.getElementById("musicPlayer");
    if (musicPlayer) {
        musicPlayer.addEventListener("timeupdate", updateMusicUI);
        musicPlayer.addEventListener("loadedmetadata", updateMusicUI);
        musicPlayer.addEventListener("ended", function () {
            nextTrack();
            const playPauseBtn = document.getElementById("playPauseBtn");
            if (playPauseBtn) {
                playPauseBtn.textContent = "▶";
            }
        });
        musicPlayer.addEventListener("play", function () {
            const playPauseBtn = document.getElementById("playPauseBtn");
            if (playPauseBtn) {
                playPauseBtn.textContent = "❚❚";
            }
        });
        musicPlayer.addEventListener("pause", function () {
            const playPauseBtn = document.getElementById("playPauseBtn");
            if (playPauseBtn && musicPlayer.currentTime !== 0) {
                playPauseBtn.textContent = "▶";
            }
        });
    }

    const desktop = document.querySelector(".desktop");
    if (desktop) {
        desktop.addEventListener("click", function (event) {
            if (event.target === desktop) {
                clearIconSelection();
                closeStartMenu();
            }
        });
    }

    const startBtn = document.getElementById("startBtn");
    if (startBtn) {
        startBtn.addEventListener("click", function (event) {
            event.stopPropagation();
            toggleStartMenu();
        });
    }

    const startMenu = document.getElementById("startMenu");
    if (startMenu) {
        startMenu.addEventListener("click", function (event) {
            event.stopPropagation();
        });
    }

    document.querySelectorAll(".start-menu-item").forEach((item) => {
        item.addEventListener("click", function () {
            const action = item.dataset.startAction;

            if (action === "music") {
                openWindow("MusicWindow");
            } else if (action === "help") {
                openWindow("HelpWindow");
            } else if (action === "refresh") {
                refreshDesktop();
            }

            closeStartMenu();
        });
    });

    document.addEventListener("click", function () {
        closeStartMenu();
    });

    const alertBox = document.querySelector(".alert-box");
    if (alertBox) {
        alertBox.addEventListener("mousedown", function (event) {
            event.stopPropagation();
        });
    }
});
