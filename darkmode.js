/* =====================================================
   DARKMODE.JS
   Theme Management Module
=====================================================*/

// ==========================================
// ENABLE DARK MODE
// ==========================================

function enableDarkMode() {

    document.body.classList.add("dark-mode");

    localStorage.setItem("theme", "dark");

    updateDarkModeButton();

}

// ==========================================
// DISABLE DARK MODE
// ==========================================

function disableDarkMode() {

    document.body.classList.remove("dark-mode");

    localStorage.setItem("theme", "light");

    updateDarkModeButton();

}

// ==========================================
// TOGGLE DARK MODE
// ==========================================

function toggleDarkMode() {

    if (document.body.classList.contains("dark-mode")) {

        disableDarkMode();

    } else {

        enableDarkMode();

    }

}

// ==========================================
// UPDATE BUTTON ICON/TEXT
// ==========================================

function updateDarkModeButton() {

    const darkModeBtn = document.getElementById("darkModeBtn");

    if (!darkModeBtn) return;

    if (document.body.classList.contains("dark-mode")) {

        darkModeBtn.innerHTML = "☀️ Light Mode";

    } else {

        darkModeBtn.innerHTML = "🌙 Dark Mode";

    }

}

// ==========================================
// LOAD SAVED THEME
// ==========================================

function loadTheme() {

    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {

        enableDarkMode();

    } else {

        disableDarkMode();

    }

}

// ==========================================
// INITIALIZE DARK MODE
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    loadTheme();

    const darkModeBtn = document.getElementById("darkModeBtn");

    if (darkModeBtn) {

        darkModeBtn.addEventListener(

            "click",

            toggleDarkMode

        );

    }

});
