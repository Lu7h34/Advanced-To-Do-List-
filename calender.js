/* =====================================================
   CALENDAR.JS
   FullCalendar Module
=====================================================*/

let calendar = null;

// ==========================================
// INITIALIZE CALENDAR
// ==========================================

function initializeCalendar() {

    const calendarElement = document.getElementById("calendar");

    if (!calendarElement) {
        return;
    }

    calendar = new FullCalendar.Calendar(calendarElement, {

        initialView: "dayGridMonth",

        selectable: true,

        editable: true,

        height: "auto",

        headerToolbar: {
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay"
        },

        eventClick: function (info) {
            openTask(info.event.id);
        },

        dateClick: function (info) {

            if (typeof taskDate !== "undefined") {
                taskDate.value = info.dateStr;
            }

            if (typeof taskInput !== "undefined") {
                taskInput.focus();
            }

        }

    });

    enableEventDrop();
    enableResize();
    enableTooltip();

    calendar.render();

    updateCalendar();

}

// ==========================================
// UPDATE CALENDAR EVENTS
// ==========================================

function updateCalendar() {

    if (!calendar) return;

    calendar.removeAllEvents();

    todoList.forEach(task => {

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

// ==========================================
// EVENT COLOR
// ==========================================

function getTaskColor(task) {

    if (task.completed) {
        return "#198754";
    }

    switch (task.priority) {

        case "High":
            return "#dc3545";

        case "Medium":
            return "#ffc107";

        case "Low":
            return "#0d6efd";

        default:
            return "#6c757d";

    }

}

// ==========================================
// OPEN TASK
// ==========================================

function openTask(id) {

    const task = todoList.find(t => t.id == id);

    if (!task) return;

    const details = document.getElementById("taskDetails");

    if (details) {

        details.innerHTML = `

            <h4>${task.title}</h4>
            <hr>

            <p><strong>Description:</strong> ${task.description}</p>

            <p><strong>Date:</strong> ${task.date}</p>

            <p><strong>Priority:</strong> ${task.priority}</p>

            <p><strong>Category:</strong> ${task.category}</p>

            <p><strong>Status:</strong>
                ${task.completed ? "Completed" : "Pending"}
            </p>

        `;

    }

    const modal = new bootstrap.Modal(

        document.getElementById("taskModal")

    );

    modal.show();

}

// ==========================================
// CALENDAR NAVIGATION
// ==========================================

function nextMonth() {

    if (calendar) {
        calendar.next();
    }

}

function previousMonth() {

    if (calendar) {
        calendar.prev();
    }

}

function gotoDate(date) {

    if (calendar) {
        calendar.gotoDate(date);
    }

}

function refreshCalendar() {

    updateCalendar();

}

// ==========================================
// DRAG & DROP
// ==========================================

function enableEventDrop() {

    if (!calendar) return;

    calendar.setOption("eventDrop", function (info) {

        const task = todoList.find(

            t => t.id == info.event.id

        );

        if (!task) return;

        task.date = info.event.startStr;

        task.updated = new Date().toISOString();

        saveTasks();

        renderTasks();

        updateStatistics();

        updateProgress();

        updateCalendar();

        if (typeof updateReminderPanel === "function") {
            updateReminderPanel();
        }

        showToast("Task Date Updated");

    });

}

// ==========================================
// EVENT RESIZE
// ==========================================

function enableResize() {

    if (!calendar) return;

    calendar.setOption("eventResize", function (info) {

        const task = todoList.find(

            t => t.id == info.event.id

        );

        if (!task) return;

        task.date = info.event.endStr || info.event.startStr;

        saveTasks();

        renderTasks();

        updateCalendar();

        if (typeof updateReminderPanel === "function") {
            updateReminderPanel();
        }

    });

}

// ==========================================
// TOOLTIP
// ==========================================

function enableTooltip() {

    if (!calendar) return;

    calendar.setOption("eventDidMount", function (info) {

        const task = todoList.find(

            t => t.id == info.event.id

        );

        if (!task) return;

        info.el.title =

            "Task : " + task.title +

            "\nPriority : " + task.priority +

            "\nCategory : " + task.category +

            "\nStatus : " +

            (task.completed ? "Completed" : "Pending");

    });

}

// ==========================================
// CALENDAR SEARCH
// ==========================================

function searchCalendar(keyword) {

    if (!calendar) return;

    if (!keyword || keyword.trim() === "") {

        updateCalendar();

        return;

    }

    calendar.removeAllEvents();

    todoList

        .filter(task =>

            task.title

                .toLowerCase()

                .includes(keyword.toLowerCase())

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

// ==========================================
// RESTORE CALENDAR
// ==========================================

function restoreCalendar() {

    updateCalendar();

}

// ==========================================
// TODAY BUTTON
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    const todayBtn = document.getElementById("todayBtn");

    if (todayBtn) {

        todayBtn.addEventListener("click", function () {

            if (calendar) {

                calendar.today();

            }

        });

    }

    initializeCalendar();

});
