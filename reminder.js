// ===========================================
// REMINDER PANEL
// ===========================================

function updateReminderPanel() {

    const reminder = document.getElementById("reminderList");

    if (!reminder) return;

    reminder.innerHTML = "";

    const upcoming = getUpcomingTasks();

    if (upcoming.length === 0) {

        reminder.innerHTML =
            "<li class='list-group-item'>No upcoming tasks</li>";

        return;

    }

    upcoming.forEach(task => {

        const li = document.createElement("li");

        li.className = "list-group-item";

        li.innerHTML = `
            <strong>${task.title}</strong><br>
            Due: ${task.date}<br>
            Priority: ${task.priority}
        `;

        reminder.appendChild(li);

    });

}



// ===========================================
// CALENDAR SEARCH
// ===========================================

function searchCalendar(keyword) {

    if (!calendar) return;

    // Restore all events if search is empty
    if (!keyword || keyword.trim() === "") {

        updateCalendar();
        return;

    }

    calendar.removeAllEvents();

    todoList
        .filter(task =>
            task.title.toLowerCase().includes(keyword.toLowerCase())
        )
        .forEach(task => {

            calendar.addEvent({

                id: task.id,
                title: task.title,
                start: task.date,
                allDay: true,
                backgroundColor: getTaskColor(task),
                borderColor: getTaskColor(task),
                textColor: "#ffffff"

            });

        });

}



// ===========================================
// RESTORE CALENDAR
// ===========================================

function restoreCalendar() {

    updateCalendar();

}



// ===========================================
// REFRESH DASHBOARD
// ===========================================

function refreshDashboard() {

    renderTasks();

    updateStatistics();

    updateProgress();

    updateCalendar();

    updateReminderPanel();

}



// ===========================================
// INITIALIZE ADVANCED FEATURES
// ===========================================

document.addEventListener("DOMContentLoaded", function () {

    // Calendar must already be initialized
    if (calendar) {

        enableEventDrop();

        enableResize();

        enableTooltip();

    }

    updateReminderPanel();

});
