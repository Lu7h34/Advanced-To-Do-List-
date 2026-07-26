
/* =====================================================
   PART 6A
   DARK MODE + REMINDERS + SHORTCUTS
=====================================================*/

// ======================================
// DARK MODE
// ======================================

const darkModeBtn = document.getElementById("darkModeBtn");

function enableDarkMode(){

    document.body.classList.add("dark-mode");

    localStorage.setItem("theme","dark");

}

function disableDarkMode(){

    document.body.classList.remove("dark-mode");

    localStorage.setItem("theme","light");

}

function toggleDarkMode(){

    if(document.body.classList.contains("dark-mode")){

        disableDarkMode();

    }

    else{

        enableDarkMode();

    }

}

if(darkModeBtn){

    darkModeBtn.addEventListener(

        "click",

        toggleDarkMode

    );

}

if(localStorage.getItem("theme")==="dark"){

    enableDarkMode();

}



