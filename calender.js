/* =====================================================
   PART 3A
   FULL CALENDAR
=====================================================*/


// ==========================================
// INITIALIZE CALENDAR
// ==========================================

function initializeCalendar(){

    const calendarElement =

    document.getElementById("calendar");

    if(!calendarElement){

        return;

    }

    calendar = new FullCalendar.Calendar(

        calendarElement,

        {

            initialView:"dayGridMonth",

            selectable:true,

            editable:true,

            height:"auto",

            headerToolbar:{

                left:"prev,next today",

                center:"title",

                right:"dayGridMonth,timeGridWeek,timeGridDay"

            },

            eventClick:function(info){

                openTask(info.event.id);

            },

            dateClick:function(info){

                taskDate.value = info.dateStr;

                taskInput.focus();

            }

        }

    );

    calendar.render();

    updateCalendar();

}



// ==========================================
// UPDATE CALENDAR EVENTS
// ==========================================

function updateCalendar(){

    if(!calendar){

        return;

    }

    calendar.removeAllEvents();

    todoList.forEach(task=>{

        calendar.addEvent({

            id:task.id,

            title:task.title,

            start:task.date,

            allDay:true,

            backgroundColor:getTaskColor(task),

            borderColor:getTaskColor(task),

            textColor:"#ffffff"

        });

    });

}



// ==========================================
// EVENT COLOR
// ==========================================

function getTaskColor(task){

    if(task.completed){

        return "#198754";

    }

    switch(task.priority){

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
// OPEN TASK FROM CALENDAR
// ==========================================

function openTask(id){

    const task = todoList.find(

        t=>t.id===id

    );

    if(!task){

        return;

    }

    const details =

    document.getElementById("taskDetails");

    if(details){

        details.innerHTML = `

        <h4>${task.title}</h4>

        <hr>

        <p>

        <strong>Description:</strong>

        ${task.description}

        </p>

        <p>

        <strong>Date:</strong>

        ${task.date}

        </p>

        <p>

        <strong>Priority:</strong>

        ${task.priority}

        </p>

        <p>

        <strong>Category:</strong>

        ${task.category}

        </p>

        <p>

        <strong>Status:</strong>

        ${task.completed ?

        "Completed" :

        "Pending"}

        </p>

        `;

    }

    const modal =

    new bootstrap.Modal(

        document.getElementById("taskModal")

    );

    modal.show();

}



// ==========================================
// TODAY BUTTON
// ==========================================

const todayBtn =

document.getElementById("todayBtn");

if(todayBtn){

todayBtn.addEventListener(

"click",

function(){

if(calendar){

calendar.today();

}

});

}



// ==========================================
// NEXT MONTH
// ==========================================

function nextMonth(){

if(calendar){

calendar.next();

}

}



// ==========================================
// PREVIOUS MONTH
// ==========================================

function previousMonth(){

if(calendar){

calendar.prev();

}

}



// ==========================================
// GO TO DATE
// ==========================================

function gotoDate(date){

if(calendar){

calendar.gotoDate(date);

}

}



// ==========================================
// REFRESH CALENDAR
// ==========================================

function refreshCalendar(){

updateCalendar();

}



// ==========================================
// INITIALIZE AFTER PAGE LOAD
// ==========================================

document.addEventListener(

"DOMContentLoaded",

function(){

initializeCalendar();

});

/* =====================================================
   PART 3B
   ADVANCED CALENDAR FEATURES
=====================================================*/


// ===========================================
// ENABLE DRAG & DROP
// ===========================================

if(calendar){

    calendar.setOption("editable",true);

}



// ===========================================
// EVENT DROP
// ===========================================

function enableEventDrop(){

    if(!calendar) return;

    calendar.setOption("eventDrop",function(info){

        const task=todoList.find(

            t=>t.id===info.event.id

        );

        if(task){

            task.date=info.event.startStr;

            task.updated=new Date().toISOString();

        }

        saveTasks();

        renderTasks();

        updateStatistics();

        updateProgress();

        showToast("Task Date Updated");

    });

}



// ===========================================
// EVENT RESIZE
// ===========================================

function enableResize(){

    if(!calendar) return;

    calendar.setOption("eventResize",function(info){

        const task=todoList.find(

            t=>t.id===info.event.id

        );

        if(task){

            task.date=info.event.endStr ||

                      info.event.startStr;

        }

        saveTasks();

        renderTasks();

        updateCalendar();

    });

}



// ===========================================
// TOOLTIP
// ===========================================

function enableTooltip(){

    if(!calendar) return;

    calendar.setOption("eventDidMount",function(info){

        const task=todoList.find(

            t=>t.id===info.event.id

        );

        if(!task) return;

        info.el.title=

        "Task : "+task.title+

        "\nPriority : "+task.priority+

        "\nCategory : "+task.category+

        "\nStatus : "+(

            task.completed?

            "Completed":

            "Pending"

        );

    });

}



// ===========================================
// TODAY'S TASKS
// ===========================================

function highlightTodayTasks(){

    const today=new Date()

    .toISOString()

    .split("T")[0];

    return todoList.filter(

        task=>task.date===today

    );

}



// ===========================================
// UPCOMING TASKS
// ===========================================

function getUpcomingTasks(days=7){

    const today=new Date();

    const future=new Date();

    future.setDate(

        future.getDate()+days

    );

    return todoList.filter(task=>{

        const d=new Date(task.date);

        return(

            d>=today &&

            d<=future

        );

    });

}



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

