

// ===========================================
// REMINDER PANEL
// ===========================================

function updateReminderPanel(){

    const reminder=

    document.getElementById(

        "reminderList"

    );

    if(!reminder) return;

    reminder.innerHTML="";

    const upcoming=

    getUpcomingTasks();

    if(upcoming.length===0){

        reminder.innerHTML=

        "<li class='list-group-item'>No upcoming tasks</li>";

        return;

    }

    upcoming.forEach(task=>{

        const li=

        document.createElement("li");

        li.className=

        "list-group-item";

        li.innerHTML=`

        <strong>${task.title}</strong>

        <br>

        Due :

        ${task.date}

        <br>

        Priority :

        ${task.priority}

        `;

        reminder.appendChild(li);

    });

}



// ===========================================
// CALENDAR SEARCH
// ===========================================

function searchCalendar(keyword){

    if(!calendar) return;

    calendar.removeAllEvents();

    todoList

    .filter(task=>{

        return task.title

        .toLowerCase()

        .includes(

            keyword.toLowerCase()

        );

    })

    .forEach(task=>{

        calendar.addEvent({

            id:task.id,

            title:task.title,

            start:task.date,

            backgroundColor:

            getTaskColor(task)

        });

    });

}



// ===========================================
// RESTORE CALENDAR
// ===========================================

function restoreCalendar(){

    updateCalendar();

}



// ===========================================
// REFRESH
// ===========================================

function refreshDashboard(){

    renderTasks();

    updateStatistics();

    updateProgress();

    updateCalendar();

    updateReminderPanel();

}



// ===========================================
// INITIALIZE ADVANCED FEATURES
// ===========================================

document.addEventListener(

"DOMContentLoaded",

function(){

    enableEventDrop();

    enableResize();

    enableTooltip();

    updateReminderPanel();

});

