/* =====================================================
   PROFESSIONAL TODO DASHBOARD
   SCRIPT.JS
   PART 1A
=====================================================*/

// =========================
// Global Variables
// =========================

let todoList = JSON.parse(localStorage.getItem("todoList")) || [];

let calendar = null;

let pieChart = null;

let barChart = null;


// =========================
// DOM Elements
// =========================

const taskInput = document.getElementById("todo-input");

const taskDescription = document.getElementById("todo-desc");

const taskDate = document.getElementById("todo-date");

const prioritySelect = document.getElementById("priority");

const categorySelect = document.getElementById("category");

const addButton = document.getElementById("add-task");

const taskContainer = document.getElementById("todo-list");

const summaryTable = document.querySelector("#summary-table tbody");


// Statistics

const totalTasks = document.getElementById("totalTasks");

const pendingTasks = document.getElementById("pendingTasks");

const completedTasks = document.getElementById("completedTasks");

const overdueTasks = document.getElementById("overdueTasks");

const highPriority = document.getElementById("highPriority");

const completionRate = document.getElementById("completionRate");

const progressBar = document.getElementById("progressBar");


// Search

const searchTask = document.getElementById("searchTask");

const filterPriority = document.getElementById("filterPriority");

const filterStatus = document.getElementById("filterStatus");


// =========================
// Local Storage
// =========================

function saveTasks(){

    localStorage.setItem(

        "todoList",

        JSON.stringify(todoList)

    );

}


function loadTasks(){

    const data = localStorage.getItem("todoList");

    if(data){

        todoList = JSON.parse(data);

    }

}


// =========================
// Generate Unique ID
// =========================

function generateID(){

    return Date.now() + "_" + Math.floor(Math.random()*100000);

}


// =========================
// Clear Form
// =========================

function clearForm(){

    taskInput.value = "";

    taskDescription.value = "";

    taskDate.value = "";

    prioritySelect.value = "Medium";

    categorySelect.value = "Work";

}


// =========================
// Validate
// =========================

function validateTask(){

    if(taskInput.value.trim()===""){

        alert("Please enter task.");

        return false;

    }

    if(taskDate.value===""){

        alert("Please select date.");

        return false;

    }

    return true;

}


// =========================
// Add Task
// =========================

function addTask(){

    if(!validateTask()){

        return;

    }

    const task={

        id:generateID(),

        title:taskInput.value.trim(),

        description:taskDescription.value.trim(),

        date:taskDate.value,

        priority:prioritySelect.value,

        category:categorySelect.value,

        completed:false,

        created:new Date().toISOString(),

        updated:new Date().toISOString()

    };

    todoList.push(task);

    saveTasks();

    clearForm();

    renderTasks();

    updateStatistics();

    updateProgress();

    updateCalendar();

    showToast("Task Added Successfully");

}


// =========================
// Add Button Event
// =========================

addButton.addEventListener(

    "click",

    addTask

);


// =========================
// Enter Key
// =========================

taskInput.addEventListener(

    "keypress",

    function(e){

        if(e.key==="Enter"){

            addTask();

        }

    }

);


// =========================
// Initial Load
// =========================

loadTasks();

renderTasks();

updateStatistics();

updateProgress();

/* =====================================================
   PART 1B
   RENDER TASKS
=====================================================*/

// =========================
// Render Tasks
// =========================

function renderTasks() {

    taskContainer.innerHTML = "";

    summaryTable.innerHTML = "";

    todoList.forEach((task, index) => {

        const card = document.createElement("div");

        card.className = "task-card " + task.priority.toLowerCase();

        if (task.completed) {

            card.style.opacity = "0.7";

        }

        card.innerHTML = `

        <div class="d-flex justify-content-between">

            <div>

                <h5 class="task-title">

                    ${task.title}

                </h5>

                <p class="task-desc">

                    ${task.description}

                </p>

                <small>

                    📅 ${task.date}

                </small>

                <br>

                <small>

                    Category :
                    <b>${task.category}</b>

                </small>

                <br>

                <small>

                    Priority :
                    <span class="priority-${task.priority.toLowerCase()}">

                        ${task.priority}

                    </span>

                </small>

            </div>

            <div>

                ${statusBadge(task)}

            </div>

        </div>

        <hr>

        <div class="d-flex flex-wrap gap-2">

            <button
                class="btn btn-success btn-sm"

                onclick="completeTask('${task.id}')">

                Complete

            </button>

            <button
                class="btn btn-warning btn-sm"

                onclick="restartTask('${task.id}')">

                Restart

            </button>

            <button
                class="btn btn-info btn-sm"

                onclick="editTask('${task.id}')">

                Edit

            </button>

            <button
                class="btn btn-danger btn-sm"

                onclick="deleteTask('${task.id}')">

                Delete

            </button>

            <button
                class="btn btn-primary btn-sm"

                onclick="moveUp(${index})">

                ↑

            </button>

            <button
                class="btn btn-primary btn-sm"

                onclick="moveDown(${index})">

                ↓

            </button>

        </div>

        `;

        taskContainer.appendChild(card);

        renderSummary(task);

    });

}


// =========================
// Summary Table
// =========================

function renderSummary(task){

    const row=document.createElement("tr");

    row.innerHTML=`

    <td>${summaryTable.children.length+1}</td>

    <td>${task.title}</td>

    <td>${task.description}</td>

    <td>${task.date}</td>

    <td>${task.priority}</td>

    <td>${task.category}</td>

    <td>${task.completed?"Completed":"Pending"}</td>

    <td>${remainingDays(task.date)}</td>

    <td>

        <button

        class="btn btn-sm btn-info"

        onclick="editTask('${task.id}')">

        Edit

        </button>

        <button

        class="btn btn-sm btn-danger"

        onclick="deleteTask('${task.id}')">

        Delete

        </button>

    </td>

    `;

    summaryTable.appendChild(row);

}


// =========================
// Status Badge
// =========================

function statusBadge(task){

    if(task.completed){

        return '<span class="badge badge-success">Completed</span>';

    }

    if(new Date(task.date)<new Date()){

        return '<span class="badge badge-danger">Overdue</span>';

    }

    return '<span class="badge badge-warning">Pending</span>';

}


// =========================
// Remaining Days
// =========================

function remainingDays(date){

    const today=new Date();

    const due=new Date(date);

    const diff=due-today;

    const days=Math.ceil(diff/(1000*60*60*24));

    if(days<0){

        return "Overdue";

    }

    if(days===0){

        return "Today";

    }

    return days+" Days";

}


/* =====================================================
   COMPLETE TASK
=====================================================*/

function completeTask(id){

    const task=todoList.find(

        t=>t.id===id

    );

    if(task){

        task.completed=true;

        task.updated=new Date().toISOString();

    }

    saveTasks();

    renderTasks();

    updateStatistics();

    updateProgress();

    updateCalendar();

}


/* =====================================================
   RESTART TASK
=====================================================*/

function restartTask(id){

    const task=todoList.find(

        t=>t.id===id

    );

    if(task){

        task.completed=false;

    }

    saveTasks();

    renderTasks();

    updateStatistics();

    updateProgress();

}


/* =====================================================
   DELETE
=====================================================*/

function deleteTask(id){

    if(!confirm("Delete this task?")){

        return;

    }

    todoList=todoList.filter(

        t=>t.id!==id

    );

    saveTasks();

    renderTasks();

    updateStatistics();

    updateProgress();

    updateCalendar();

}


/* =====================================================
   MOVE UP
=====================================================*/

function moveUp(index){

    if(index===0)return;

    [todoList[index-1],todoList[index]]

    =[todoList[index],todoList[index-1]];

    saveTasks();

    renderTasks();

}


/* =====================================================
   MOVE DOWN
=====================================================*/

function moveDown(index){

    if(index===todoList.length-1)return;

    [todoList[index+1],todoList[index]]

    =[todoList[index],todoList[index+1]];

    saveTasks();

    renderTasks();

}

/* =====================================================
   PART 1C
   EDIT • PROGRESS • STATISTICS • TOAST
=====================================================*/


// ===========================================
// EDIT TASK
// ===========================================

function editTask(id){

    const task = todoList.find(t => t.id === id);

    if(!task) return;

    taskInput.value = task.title;

    taskDescription.value = task.description;

    taskDate.value = task.date;

    prioritySelect.value = task.priority;

    categorySelect.value = task.category;

    addButton.innerHTML =
    '<i class="fa-solid fa-pen"></i> Update Task';

    addButton.onclick = function(){

        updateTask(id);

    };

}


// ===========================================
// UPDATE TASK
// ===========================================

function updateTask(id){

    if(!validateTask()){

        return;

    }

    const task = todoList.find(t => t.id === id);

    if(task){

        task.title = taskInput.value.trim();

        task.description = taskDescription.value.trim();

        task.date = taskDate.value;

        task.priority = prioritySelect.value;

        task.category = categorySelect.value;

        task.updated = new Date().toISOString();

    }

    saveTasks();

    clearForm();

    renderTasks();

    updateStatistics();

    updateProgress();

    updateCalendar();

    addButton.innerHTML =
    '<i class="fa-solid fa-plus"></i> Add Task';

    addButton.onclick = addTask;

    showToast("Task Updated Successfully");

}



// ===========================================
// PROGRESS BAR
// ===========================================

function updateProgress(){

    const total = todoList.length;

    const completed = todoList.filter(

        t=>t.completed

    ).length;

    let percentage = 0;

    if(total>0){

        percentage = Math.round(

            (completed/total)*100

        );

    }

    progressBar.style.width = percentage+"%";

    progressBar.innerHTML = percentage+"%";

}



// ===========================================
// STATISTICS
// ===========================================

function updateStatistics(){

    const total = todoList.length;

    const completed = todoList.filter(

        t=>t.completed

    ).length;

    const pending = total-completed;

    const overdue = todoList.filter(t=>{

        return (

            !t.completed &&

            new Date(t.date)<new Date()

        );

    }).length;

    const high = todoList.filter(

        t=>t.priority==="High"

    ).length;

    totalTasks.innerHTML = total;

    pendingTasks.innerHTML = pending;

    completedTasks.innerHTML = completed;

    overdueTasks.innerHTML = overdue;

    highPriority.innerHTML = high;

    if(total===0){

        completionRate.innerHTML="0%";

    }

    else{

        completionRate.innerHTML =

        Math.round(

        completed/total*100

        )+"%";

    }

}



// ===========================================
// RESET BUTTON
// ===========================================

function resetDashboard(){

    if(

        confirm(

        "Delete every task?"

        )

    ){

        todoList=[];

        saveTasks();

        renderTasks();

        updateStatistics();

        updateProgress();

        updateCalendar();

        showToast(

        "Dashboard Reset"

        );

    }

}



// ===========================================
// TOAST
// ===========================================

function showToast(message){

    const body = document.getElementById(

        "toastMessage"

    );

    body.innerHTML = message;

    const toastElement = document.getElementById(

        "liveToast"

    );

    const toast =

    new bootstrap.Toast(

        toastElement

    );

    toast.show();

}



// ===========================================
// ACTIVITY LOG
// ===========================================

function addLog(text){

    const log = document.getElementById(

        "logList"

    );

    if(!log) return;

    const li=document.createElement("li");

    li.innerHTML=

    new Date().toLocaleString()

    +"<br>"+text;

    log.prepend(li);

}



// ===========================================
// SAVE EVENT
// ===========================================

window.addEventListener(

"beforeunload",

function(){

saveTasks();

});



// ===========================================
// INITIALIZE
// ===========================================

document.addEventListener(

"DOMContentLoaded",

function(){

loadTasks();

renderTasks();

updateStatistics();

updateProgress();

updateCalendar();

});

/* =====================================================
   PART 2A
   SEARCH & FILTERS
=====================================================*/


// ========================================
// CURRENT FILTERS
// ========================================

let currentSearch = "";

let currentPriority = "All";

let currentStatus = "All Status";

let currentCategory = "All";



// ========================================
// SEARCH
// ========================================

searchTask.addEventListener(

    "keyup",

    function(){

        currentSearch =

        this.value.toLowerCase();

        applyFilters();

    }

);



// ========================================
// PRIORITY FILTER
// ========================================

filterPriority.addEventListener(

    "change",

    function(){

        currentPriority = this.value;

        applyFilters();

    }

);



// ========================================
// STATUS FILTER
// ========================================

filterStatus.addEventListener(

    "change",

    function(){

        currentStatus = this.value;

        applyFilters();

    }

);



// ========================================
// CATEGORY FILTER
// ========================================

const categoryFilter = document.getElementById(

    "categoryFilter"

);

if(categoryFilter){

categoryFilter.addEventListener(

"change",

function(){

currentCategory=this.value;

applyFilters();

});

}



// ========================================
// APPLY FILTERS
// ========================================

function applyFilters(){

    let filtered = [...todoList];



    // ---------------------
    // SEARCH
    // ---------------------

    if(currentSearch!=""){

        filtered = filtered.filter(task=>{

            return (

                task.title

                .toLowerCase()

                .includes(currentSearch)

                ||

                task.description

                .toLowerCase()

                .includes(currentSearch)

                ||

                task.category

                .toLowerCase()

                .includes(currentSearch)

                ||

                task.priority

                .toLowerCase()

                .includes(currentSearch)

            );

        });

    }



    // ---------------------
    // PRIORITY
    // ---------------------

    if(currentPriority!="All"){

        filtered = filtered.filter(

            task=>task.priority===currentPriority

        );

    }



    // ---------------------
    // STATUS
    // ---------------------

    if(currentStatus!="All Status"){

        filtered = filtered.filter(task=>{

            if(currentStatus==="Completed"){

                return task.completed;

            }

            if(currentStatus==="Pending"){

                return !task.completed;

            }

            if(currentStatus==="Overdue"){

                return (

                    !task.completed &&

                    new Date(task.date)<new Date()

                );

            }

            return true;

        });

    }



    // ---------------------
    // CATEGORY
    // ---------------------

    if(currentCategory!="All"){

        filtered = filtered.filter(

            task=>task.category===currentCategory

        );

    }



    renderFilteredTasks(filtered);

}



// ========================================
// RENDER FILTERED TASKS
// ========================================

function renderFilteredTasks(list){

    taskContainer.innerHTML="";

    summaryTable.innerHTML="";



    list.forEach((task,index)=>{

        const card=document.createElement("div");



        card.className=

        "task-card "+

        task.priority.toLowerCase();



        card.innerHTML=`

        <div class="d-flex justify-content-between">

            <div>

                <h5>

                    ${task.title}

                </h5>

                <p>

                    ${task.description}

                </p>

                <small>

                    📅 ${task.date}

                </small>

                <br>

                <small>

                    ${task.category}

                </small>

            </div>

            <div>

                ${statusBadge(task)}

            </div>

        </div>



        <hr>



        <button

        class="btn btn-success btn-sm"

        onclick="completeTask('${task.id}')">

        Complete

        </button>



        <button

        class="btn btn-warning btn-sm"

        onclick="restartTask('${task.id}')">

        Restart

        </button>



        <button

        class="btn btn-info btn-sm"

        onclick="editTask('${task.id}')">

        Edit

        </button>



        <button

        class="btn btn-danger btn-sm"

        onclick="deleteTask('${task.id}')">

        Delete

        </button>

        `;



        taskContainer.appendChild(card);



        renderSummary(task);

    });



}

/* =====================================================
   PART 2B
   SORTING • PINNING • FAVORITES • CLEAR FILTERS
=====================================================*/


// ========================================
// SORT DROPDOWN
// ========================================

let currentSort = "None";

const sortTasks = document.getElementById("sortTasks");

if(sortTasks){

    sortTasks.addEventListener("change",function(){

        currentSort = this.value;

        applySorting();

    });

}


// ========================================
// APPLY SORTING
// ========================================

function applySorting(){

    let list = [...todoList];

    switch(currentSort){

        case "Date":

            list.sort((a,b)=>

                new Date(a.date)-new Date(b.date)

            );

            break;

        case "Priority":

            const priorityMap={

                High:1,

                Medium:2,

                Low:3

            };

            list.sort((a,b)=>

                priorityMap[a.priority]-

                priorityMap[b.priority]

            );

            break;

        case "A-Z":

            list.sort((a,b)=>

                a.title.localeCompare(b.title)

            );

            break;

        case "Z-A":

            list.sort((a,b)=>

                b.title.localeCompare(a.title)

            );

            break;

        case "Newest":

            list.sort((a,b)=>

                new Date(b.created)-

                new Date(a.created)

            );

            break;

        case "Oldest":

            list.sort((a,b)=>

                new Date(a.created)-

                new Date(b.created)

            );

            break;

    }

    renderFilteredTasks(list);

}



// ========================================
// PIN TASK
// ========================================

function pinTask(id){

    const index = todoList.findIndex(

        t=>t.id===id

    );

    if(index<0)return;

    const task=todoList.splice(index,1)[0];

    task.pinned=true;

    todoList.unshift(task);

    saveTasks();

    renderTasks();

}



// ========================================
// FAVORITE TASK
// ========================================

function favoriteTask(id){

    const task=todoList.find(

        t=>t.id===id

    );

    if(!task)return;

    task.favorite=!task.favorite;

    saveTasks();

    renderTasks();

}



// ========================================
// CLEAR FILTERS
// ========================================

function clearFilters(){

    currentSearch="";

    currentPriority="All";

    currentStatus="All Status";

    currentCategory="All";

    currentSort="None";

    searchTask.value="";

    filterPriority.value="All";

    filterStatus.value="All Status";

    if(categoryFilter){

        categoryFilter.value="All";

    }

    if(sortTasks){

        sortTasks.value="None";

    }

    renderTasks();

}



// ========================================
// OVERDUE TASKS
// ========================================

function getOverdueTasks(){

    return todoList.filter(task=>{

        return(

            !task.completed &&

            new Date(task.date)<new Date()

        );

    });

}



// ========================================
// TODAY TASKS
// ========================================

function getTodayTasks(){

    const today=new Date()

        .toISOString()

        .split("T")[0];

    return todoList.filter(

        task=>task.date===today

    );

}



// ========================================
// HIGH PRIORITY
// ========================================

function getHighPriority(){

    return todoList.filter(

        task=>

        task.priority==="High"

    );

}



// ========================================
// MARK ALL COMPLETE
// ========================================

function completeAll(){

    if(

        !confirm(

            "Complete every task?"

        )

    ) return;

    todoList.forEach(task=>{

        task.completed=true;

    });

    saveTasks();

    renderTasks();

    updateStatistics();

    updateProgress();

}



// ========================================
// RESTART ALL
// ========================================

function restartAll(){

    todoList.forEach(task=>{

        task.completed=false;

    });

    saveTasks();

    renderTasks();

    updateStatistics();

    updateProgress();

}



// ========================================
// DELETE COMPLETED
// ========================================

function deleteCompleted(){

    if(

        !confirm(

            "Delete completed tasks?"

        )

    ) return;

    todoList=

    todoList.filter(

        task=>!task.completed

    );

    saveTasks();

    renderTasks();

    updateStatistics();

    updateProgress();

}



// ========================================
// SEARCH SHORTCUT
// ========================================

document.addEventListener(

"keydown",

function(e){

    if(

        e.ctrlKey &&

        e.key==="f"

    ){

        e.preventDefault();

        searchTask.focus();

    }

});



// ========================================
// AUTO SAVE
// ========================================

setInterval(function(){

    saveTasks();

},30000);

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

/* =====================================================
   PART 4A
   CHART.JS DASHBOARD
=====================================================*/


// =======================================
// PIE CHART
// =======================================

function createPieChart(){

    const canvas=document.getElementById("pieChart");

    if(!canvas) return;

    const completed=todoList.filter(
        t=>t.completed
    ).length;

    const pending=todoList.length-completed;

    if(pieChart){

        pieChart.destroy();

    }

    pieChart=new Chart(canvas,{

        type:"pie",

        data:{

            labels:["Completed","Pending"],

            datasets:[{

                data:[completed,pending],

                backgroundColor:[
                    "#198754",
                    "#ffc107"
                ],

                borderWidth:1

            }]

        },

        options:{

            responsive:true,

            plugins:{

                legend:{
                    position:"bottom"
                }

            }

        }

    });

}



// =======================================
// PRIORITY BAR CHART
// =======================================

function createBarChart(){

    const canvas=document.getElementById("barChart");

    if(!canvas) return;

    const high=todoList.filter(
        t=>t.priority==="High"
    ).length;

    const medium=todoList.filter(
        t=>t.priority==="Medium"
    ).length;

    const low=todoList.filter(
        t=>t.priority==="Low"
    ).length;

    if(barChart){

        barChart.destroy();

    }

    barChart=new Chart(canvas,{

        type:"bar",

        data:{

            labels:["High","Medium","Low"],

            datasets:[{

                label:"Tasks",

                data:[
                    high,
                    medium,
                    low
                ],

                backgroundColor:[
                    "#dc3545",
                    "#ffc107",
                    "#0d6efd"
                ]

            }]

        },

        options:{

            responsive:true,

            scales:{

                y:{

                    beginAtZero:true,

                    ticks:{
                        precision:0
                    }

                }

            }

        }

    });

}



// =======================================
// REFRESH CHARTS
// =======================================

function updateCharts(){

    createPieChart();

    createBarChart();

}



// =======================================
// PRODUCTIVITY SCORE
// =======================================

function productivityScore(){

    if(todoList.length===0){

        return 0;

    }

    const completed=todoList.filter(

        t=>t.completed

    ).length;

    return Math.round(

        completed/

        todoList.length*100

    );

}



// =======================================
// UPDATE PRODUCTIVITY CARD
// =======================================

document.getElementById("productivityScore")

function updateProductivityCard(){

    const card=document.getElementById(

        "productivityScore"

    );

    if(card){

        card.innerHTML=

        productivityScore()+"%";

    }

}



// =======================================
// WEEKLY SUMMARY
// =======================================

function weeklySummary(){

    const summary={

        completed:0,

        pending:0

    };

    const today=new Date();

    const weekAgo=new Date();

    weekAgo.setDate(

        today.getDate()-7

    );

    todoList.forEach(task=>{

        const d=new Date(task.date);

        if(d>=weekAgo && d<=today){

            if(task.completed){

                summary.completed++;

            }else{

                summary.pending++;

            }

        }

    });

    return summary;

}



// =======================================
// MONTHLY SUMMARY
// =======================================

function monthlySummary(){

    const month=new Date().getMonth();

    return todoList.filter(task=>{

        return new Date(task.date)

        .getMonth()===month;

    }).length;

}



// =======================================
// CHART REFRESH
// =======================================

function refreshStatistics(){

    updateStatistics();

    updateCharts();

    updateProductivityCard();

}



// =======================================
// INITIALIZE
// =======================================

document.addEventListener(

"DOMContentLoaded",

function(){

    updateCharts();

    updateProductivityCard();

});

/* =====================================================
   PART 4B
   ADVANCED CHARTS
=====================================================*/

let lineChart = null;
let doughnutChart = null;

// ======================================
// COMPLETION TREND
// ======================================

function createLineChart(){

    const canvas = document.getElementById("lineChart");

    if(!canvas) return;

    if(lineChart){

        lineChart.destroy();

    }

    const last7Days = [];
    const completedCount = [];

    for(let i=6;i>=0;i--){

        const day = new Date();

        day.setDate(day.getDate()-i);

        const date = day.toISOString().split("T")[0];

        last7Days.push(date.substring(5));

        const count = todoList.filter(task=>{

            return task.completed &&
            task.updated &&
            task.updated.startsWith(date);

        }).length;

        completedCount.push(count);

    }

    lineChart = new Chart(canvas,{

        type:"line",

        data:{

            labels:last7Days,

            datasets:[{

                label:"Completed Tasks",

                data:completedCount,

                fill:false,

                borderColor:"#0d6efd",

                backgroundColor:"#0d6efd",

                tension:0.3

            }]

        },

        options:{

            responsive:true,

            plugins:{

                legend:{
                    display:true
                }

            },

            scales:{

                y:{
                    beginAtZero:true
                }

            }

        }

    });

}



// ======================================
// CATEGORY DISTRIBUTION
// ======================================

function createDoughnutChart(){

    const canvas = document.getElementById("doughnutChart");

    if(!canvas) return;

    if(doughnutChart){

        doughnutChart.destroy();

    }

    const categories = {};

    todoList.forEach(task=>{

        if(categories[task.category]){

            categories[task.category]++;

        }

        else{

            categories[task.category]=1;

        }

    });

    doughnutChart = new Chart(canvas,{

        type:"doughnut",

        data:{

            labels:Object.keys(categories),

            datasets:[{

                data:Object.values(categories),

                backgroundColor:[

                    "#0d6efd",

                    "#198754",

                    "#ffc107",

                    "#dc3545",

                    "#6f42c1",

                    "#20c997",

                    "#fd7e14"

                ]

            }]

        },

        options:{

            responsive:true,

            plugins:{

                legend:{
                    position:"bottom"
                }

            }

        }

    });

}



// ======================================
// UPDATE ALL CHARTS
// ======================================

function updateAllCharts(){

    createPieChart();

    createBarChart();

    createLineChart();

    createDoughnutChart();

}



// ======================================
// AUTO REFRESH EVERY 30 SECONDS
// ======================================

setInterval(function(){

    updateAllCharts();

},30000);



// ======================================
// REFRESH WHEN DATA CHANGES
// ======================================

const originalRender = renderTasks;

renderTasks = function(){

    originalRender();

    updateAllCharts();

    updateProductivityCard();

};

/* =====================================================
   PART 5A
   EXPORT / IMPORT
=====================================================*/


// ====================================
// EXPORT TO EXCEL
// ====================================

function exportExcel(){

    const data = todoList.map(task=>({

        Title:task.title,

        Description:task.description,

        Date:task.date,

        Priority:task.priority,

        Category:task.category,

        Status:task.completed ?

        "Completed":"Pending"

    }));

    const ws = XLSX.utils.json_to_sheet(data);

    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(

        wb,

        ws,

        "Tasks"

    );

    XLSX.writeFile(

        wb,

        "TodoDashboard.xlsx"

    );

}



// ====================================
// EXPORT PDF
// ====================================

function exportPDF(){

    const {jsPDF}=window.jspdf;

    const doc=new jsPDF();

    doc.setFontSize(18);

    doc.text(

        "Todo Dashboard Report",

        14,

        20

    );

    const rows=[];

    todoList.forEach(task=>{

        rows.push([

            task.title,

            task.date,

            task.priority,

            task.category,

            task.completed?

            "Completed":

            "Pending"

        ]);

    });

    doc.autoTable({

        head:[[

            "Task",

            "Date",

            "Priority",

            "Category",

            "Status"

        ]],

        body:rows,

        startY:30

    });

    doc.save(

        "TodoDashboard.pdf"

    );

}



// ====================================
// BACKUP JSON
// ====================================

function backupJSON(){

    const data=

    JSON.stringify(

        todoList,

        null,

        2

    );

    const blob=

    new Blob(

        [data],

        {

            type:"application/json"

        }

    );

    const url=

    URL.createObjectURL(blob);

    const a=

    document.createElement("a");

    a.href=url;

    a.download="TodoBackup.json";

    a.click();

    URL.revokeObjectURL(url);

}



// ====================================
// IMPORT FILE
// ====================================

document

.getElementById("importFile")

.addEventListener(

"change",

importFile

);



function importFile(e){

    const file=e.target.files[0];

    if(!file) return;

    const extension=

    file.name

    .split(".")

    .pop()

    .toLowerCase();

    if(extension==="json"){

        importJSON(file);

    }

    else{

        alert(

        "Excel import will be added in Part 5B"

        );

    }

}



// ====================================
// IMPORT JSON
// ====================================

function importJSON(file){

    const reader=

    new FileReader();

    reader.onload=function(e){

        try{

            todoList=

            JSON.parse(

                e.target.result

            );

            saveTasks();

            refreshDashboard();

            updateAllCharts();

            showToast(

            "Backup Imported"

            );

        }

        catch{

            alert(

            "Invalid JSON File"

            );

        }

    };

    reader.readAsText(file);

}

/* =====================================================
   PART 5B
   IMPORT EXCEL / CSV
   RECYCLE BIN
=====================================================*/

let deletedTasks = [];


// =====================================
// IMPORT EXCEL
// =====================================

function importExcel(file){

    const reader = new FileReader();

    reader.onload = function(e){

        const data = new Uint8Array(e.target.result);

        const workbook = XLSX.read(data,{

            type:"array"

        });

        const sheet = workbook.Sheets[
            workbook.SheetNames[0]
        ];

        const rows = XLSX.utils.sheet_to_json(sheet);

        rows.forEach(row=>{

            const task={

                id:generateID(),

                title:row.Title || row.Task || "",

                description:row.Description || "",

                date:row.Date || "",

                priority:row.Priority || "Medium",

                category:row.Category || "Work",

                completed:

                row.Status==="Completed",

                created:new Date().toISOString(),

                updated:new Date().toISOString()

            };

            addImportedTask(task);

        });

        saveTasks();

        refreshDashboard();

        updateAllCharts();

        showToast("Excel Imported");

    };

    reader.readAsArrayBuffer(file);

}



// =====================================
// IMPORT CSV
// =====================================

function importCSV(file){

    const reader = new FileReader();

    reader.onload=function(e){

        const lines=e.target.result.split("\n");

        lines.shift();

        lines.forEach(line=>{

            if(line.trim()==="") return;

            const col=line.split(",");

            const task={

                id:generateID(),

                title:col[0],

                description:col[1],

                date:col[2],

                priority:col[3],

                category:col[4],

                completed:

                col[5]==="Completed",

                created:new Date().toISOString(),

                updated:new Date().toISOString()

            };

            addImportedTask(task);

        });

        saveTasks();

        refreshDashboard();

        updateAllCharts();

    };

    reader.readAsText(file);

}



// =====================================
// DUPLICATE CHECK
// =====================================

function addImportedTask(task){

    const duplicate=

    todoList.find(t=>

        t.title===task.title &&

        t.date===task.date

    );

    if(!duplicate){

        todoList.push(task);

    }

}



// =====================================
// UPDATE IMPORT
// =====================================

function importFile(e){

    const file=e.target.files[0];

    if(!file) return;

    const ext=file.name

    .split(".")

    .pop()

    .toLowerCase();

    switch(ext){

        case "json":

            importJSON(file);

            break;

        case "xlsx":

        case "xls":

            importExcel(file);

            break;

        case "csv":

            importCSV(file);

            break;

        default:

            alert("Unsupported File");

    }

}



// =====================================
// DELETE TASK
// =====================================

function deleteTask(id){

    const index=

    todoList.findIndex(

        t=>t.id===id

    );

    if(index<0) return;

    deletedTasks.push(

        todoList[index]

    );

    todoList.splice(index,1);

    saveTasks();

    refreshDashboard();

}



// =====================================
// RESTORE LAST
// =====================================

function restoreLastDeleted(){

    if(deletedTasks.length===0){

        alert(

        "Recycle Bin Empty"

        );

        return;

    }

    const task=

    deletedTasks.pop();

    todoList.push(task);

    saveTasks();

    refreshDashboard();

}



// =====================================
// EMPTY BIN
// =====================================

function emptyRecycleBin(){

    if(

        confirm(

        "Delete Recycle Bin?"

        )

    ){

        deletedTasks=[];

    }

}



// =====================================
// DRAG & DROP
// =====================================

const dropArea=

document.getElementById(

"dropZone"

);

if(dropArea){

dropArea.addEventListener(

"dragover",

function(e){

e.preventDefault();

dropArea.classList.add(

"border-primary"

);

});

dropArea.addEventListener(

"dragleave",

function(){

dropArea.classList.remove(

"border-primary"

);

});

dropArea.addEventListener(

"drop",

function(e){

e.preventDefault();

dropArea.classList.remove(

"border-primary"

);

const file=

e.dataTransfer.files[0];

if(file){

importFile({

target:{

files:[file]

}

});

}

});

}



// =====================================
// AUTO BACKUP
// =====================================

setInterval(function(){

localStorage.setItem(

"todoBackup",

JSON.stringify(todoList)

);

},60000);



// =====================================
// RESTORE AUTO BACKUP
// =====================================

function restoreBackup(){

const data=

localStorage.getItem(

"todoBackup"

);

if(data){

todoList=

JSON.parse(data);

refreshDashboard();

showToast(

"Backup Restored"

);

}

}

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



// ======================================
// NOTIFICATION PERMISSION
// ======================================

function requestNotificationPermission(){

    if("Notification" in window){

        if(Notification.permission!=="granted"){

            Notification.requestPermission();

        }

    }

}



// ======================================
// SEND NOTIFICATION
// ======================================

function sendNotification(title,message){

    if(Notification.permission==="granted"){

        new Notification(title,{

            body:message,

            icon:"https://cdn-icons-png.flaticon.com/512/1827/1827392.png"

        });

    }

}



// ======================================
// PLAY SOUND
// ======================================

function playReminderSound(){

    const audio=new Audio(

        "https://actions.google.com/sounds/v1/alarms/beep_short.ogg"

    );

    audio.play();

}



// ======================================
// CHECK REMINDERS
// ======================================

function checkReminders(){

    const today=new Date()

    .toISOString()

    .split("T")[0];

    todoList.forEach(task=>{

        if(

            !task.completed &&

            task.date===today

        ){

            sendNotification(

                "Task Reminder",

                task.title

            );

            playReminderSound();

        }

    });

}



// ======================================
// CHECK EVERY MINUTE
// ======================================

setInterval(

    checkReminders,

    60000

);



// ======================================
// KEYBOARD SHORTCUTS
// ======================================

document.addEventListener(

"keydown",

function(e){

    if(e.ctrlKey && e.key==="n"){

        e.preventDefault();

        taskInput.focus();

    }

    if(e.ctrlKey && e.key==="s"){

        e.preventDefault();

        saveTasks();

        showToast("Tasks Saved");

    }

    if(e.ctrlKey && e.key==="d"){

        e.preventDefault();

        toggleDarkMode();

    }

    if(e.ctrlKey && e.key==="e"){

        e.preventDefault();

        exportExcel();

    }

    if(e.ctrlKey && e.key==="p"){

        e.preventDefault();

        exportPDF();

    }

});



// ======================================
// PAGE LOAD
// ======================================

document.addEventListener(

"DOMContentLoaded",

function(){

    requestNotificationPermission();

    checkReminders();

});

/* =====================================================
   PART 6B-1
   FAVORITES • TAGS • STICKY NOTES
=====================================================*/

// ===========================================
// FAVORITE TASK
// ===========================================

function toggleFavorite(id){

    const task = todoList.find(t => t.id === id);

    if(!task) return;

    task.favorite = !task.favorite;

    saveTasks();

    renderTasks();

    showToast(
        task.favorite
        ? "Added to Favorites"
        : "Removed from Favorites"
    );

}



// ===========================================
// GET FAVORITES
// ===========================================

function getFavoriteTasks(){

    return todoList.filter(

        task => task.favorite

    );

}



// ===========================================
// RENDER FAVORITES
// ===========================================

function renderFavorites(){

    const panel =

    document.getElementById("favoriteList");

    if(!panel) return;

    panel.innerHTML = "";

    const favorites = getFavoriteTasks();

    if(favorites.length===0){

        panel.innerHTML =

        "<p>No Favorite Tasks</p>";

        return;

    }

    favorites.forEach(task=>{

        const div =

        document.createElement("div");

        div.className="card mb-2";

        div.innerHTML =

        `

        <div class="card-body">

            ⭐ <strong>

            ${task.title}

            </strong>

            <br>

            ${task.date}

        </div>

        `;

        panel.appendChild(div);

    });

}



// ===========================================
// ADD TAG
// ===========================================

function addTag(id,tag){

    const task=

    todoList.find(

        t=>t.id===id

    );

    if(!task) return;

    if(!task.tags){

        task.tags=[];

    }

    if(!task.tags.includes(tag)){

        task.tags.push(tag);

    }

    saveTasks();

    renderTasks();

}



// ===========================================
// REMOVE TAG
// ===========================================

function removeTag(id,tag){

    const task=

    todoList.find(

        t=>t.id===id

    );

    if(!task) return;

    if(!task.tags) return;

    task.tags=

    task.tags.filter(

        t=>t!==tag

    );

    saveTasks();

    renderTasks();

}



// ===========================================
// DISPLAY TAGS
// ===========================================

function renderTags(task){

    if(!task.tags ||

       task.tags.length===0)

    return "";

    return task.tags.map(tag=>

    `

    <span class="badge bg-info me-1">

    ${tag}

    </span>

    `).join("");

}



// ===========================================
// STICKY NOTES
// ===========================================

let stickyNotes=

JSON.parse(

localStorage.getItem(

"stickyNotes"

)

)||[];



function saveStickyNotes(){

localStorage.setItem(

"stickyNotes",

JSON.stringify(stickyNotes)

);

}



// ===========================================
// ADD NOTE
// ===========================================

function addStickyNote(){

const text=

prompt(

"Enter Note"

);

if(!text) return;

stickyNotes.push({

id:Date.now(),

text:text

});

saveStickyNotes();

renderStickyNotes();

}



// ===========================================
// DELETE NOTE
// ===========================================

function deleteSticky(id){

stickyNotes=

stickyNotes.filter(

note=>note.id!==id

);

saveStickyNotes();

renderStickyNotes();

}



// ===========================================
// RENDER NOTES
// ===========================================

function renderStickyNotes(){

const panel=

document.getElementById(

"stickyPanel"

);

if(!panel) return;

panel.innerHTML="";

stickyNotes.forEach(note=>{

const card=

document.createElement("div");

card.className=

"card bg-warning mb-2";

card.innerHTML=

`

<div class="card-body">

${note.text}

<hr>

<button

class="btn btn-sm btn-danger"

onclick="deleteSticky(${note.id})">

Delete

</button>

</div>

`;

panel.appendChild(card);

});

}



// ===========================================
// INITIALIZE
// ===========================================

document.addEventListener(

"DOMContentLoaded",

function(){

renderFavorites();

renderStickyNotes();

});

/* =====================================================
   PART 6B-2
   POMODORO TIMER + RECURRING TASKS
=====================================================*/


// ============================================
// POMODORO TIMER
// ============================================

let timer;
let timerRunning = false;

let minutes = 25;
let seconds = 0;


// ============================================
// DISPLAY TIMER
// ============================================

function updateTimerDisplay(){

    const display = document.getElementById("timerDisplay");

    if(!display) return;

    display.innerHTML =

        String(minutes).padStart(2,"0")+

        ":"+

        String(seconds).padStart(2,"0");

}



// ============================================
// START TIMER
// ============================================

function startTimer(){

    if(timerRunning) return;

    timerRunning = true;

    timer = setInterval(function(){

        if(seconds===0){

            if(minutes===0){

                clearInterval(timer);

                timerRunning=false;

                updateTimerDisplay();

                timerFinished();

                return;

            }

            minutes--;

            seconds=59;

        }

        else{

            seconds--;

        }

        updateTimerDisplay();

    },1000);

}



// ============================================
// PAUSE TIMER
// ============================================

function pauseTimer(){

    clearInterval(timer);

    timerRunning=false;

}



// ============================================
// RESET TIMER
// ============================================

function resetTimer(){

    clearInterval(timer);

    timerRunning=false;

    minutes=25;

    seconds=0;

    updateTimerDisplay();

}



// ============================================
// TIMER COMPLETE
// ============================================

function timerFinished(){

    playReminderSound();

    showToast("Pomodoro Session Complete!");

    sendNotification(

        "Pomodoro Complete",

        "Time for a short break."

    );

}



// ============================================
// COUNTDOWN TO DUE DATE
// ============================================

function getCountdown(task){

    const now = new Date();

    const due = new Date(task.date);

    const diff = due-now;

    if(diff<=0){

        return "Overdue";

    }

    const days = Math.floor(

        diff/(1000*60*60*24)

    );

    const hours = Math.floor(

        (diff%(1000*60*60*24))

        /(1000*60*60)

    );

    return days+"d "+hours+"h";

}



// ============================================
// RECURRING TASKS
// ============================================

function createRecurringTask(task){

    if(!task.repeat) return;

    const next = new Date(task.date);

    switch(task.repeat){

        case "Daily":

            next.setDate(next.getDate()+1);

            break;

        case "Weekly":

            next.setDate(next.getDate()+7);

            break;

        case "Monthly":

            next.setMonth(next.getMonth()+1);

            break;

        default:

            return;

    }

    const newTask={

        ...task,

        id:generateID(),

        completed:false,

        date:next.toISOString().split("T")[0],

        created:new Date().toISOString(),

        updated:new Date().toISOString()

    };

    todoList.push(newTask);

}



// ============================================
// CHECK COMPLETED RECURRING TASKS
// ============================================

function checkRecurringTasks(){

    todoList.forEach(task=>{

        if(task.completed && task.repeat){

            createRecurringTask(task);

            task.repeatCompleted=true;

        }

    });

    todoList = todoList.filter(

        task=>!task.repeatCompleted

    );

    saveTasks();

}



// ============================================
// DAILY CHECK
// ============================================

setInterval(function(){

    checkRecurringTasks();

},60000);



// ============================================
// QUICK TIMER BUTTONS
// ============================================

function setPomodoro25(){

    minutes=25;

    seconds=0;

    updateTimerDisplay();

}

function setShortBreak(){

    minutes=5;

    seconds=0;

    updateTimerDisplay();

}

function setLongBreak(){

    minutes=15;

    seconds=0;

    updateTimerDisplay();

}



// ============================================
// INITIALIZE TIMER
// ============================================

document.addEventListener(

"DOMContentLoaded",

function(){

    updateTimerDisplay();

});


/* =====================================================
   PART 6B-3
   PRODUCTIVITY • THEMES • PROFILE
=====================================================*/


// ==========================================
// USER PROFILE
// ==========================================

let userProfile = JSON.parse(

localStorage.getItem("userProfile")

)||{

name:"Guest",

theme:"Blue",

streak:0

};


function saveProfile(){

localStorage.setItem(

"userProfile",

JSON.stringify(userProfile)

);

}



// ==========================================
// UPDATE PROFILE
// ==========================================

function updateProfile(){

const name=prompt(

"Enter your name",

userProfile.name

);

if(name){

userProfile.name=name;

saveProfile();

renderProfile();

}

}



function renderProfile(){

const profile=

document.getElementById(

"userProfile"

);

if(!profile) return;

profile.innerHTML=

`

<h5>

👤 ${userProfile.name}

</h5>

<p>

🔥 Streak :

${userProfile.streak}

days

</p>

`;

}



// ==========================================
// PRODUCTIVITY STREAK
// ==========================================

function updateStreak(){

const today=

new Date()

.toISOString()

.split("T")[0];

const completed=

todoList.filter(task=>

task.completed &&

task.updated &&

task.updated.startsWith(today)

).length;

if(completed>=3){

userProfile.streak++;

}

saveProfile();

renderProfile();

}



// ==========================================
// DAILY SCORE
// ==========================================

function dailyScore(){

const today=

new Date()

.toISOString()

.split("T")[0];

const todayTasks=

todoList.filter(task=>

task.date===today

);

if(todayTasks.length===0)

return 100;

const completed=

todayTasks.filter(

t=>t.completed

).length;

return Math.round(

completed/

todayTasks.length*100

);

}



function updateDailyScore(){

const score=

document.getElementById(

"dailyScore"

);

if(score){

score.innerHTML=

dailyScore()+"%";

}

}



// ==========================================
// ACHIEVEMENTS
// ==========================================

function checkAchievements(){

const completed=

todoList.filter(

t=>t.completed

).length;

if(completed>=10){

showAchievement(

"🏅 Completed 10 Tasks"

);

}

if(completed>=25){

showAchievement(

"🥈 Completed 25 Tasks"

);

}

if(completed>=50){

showAchievement(

"🥇 Completed 50 Tasks"

);

}

}



function showAchievement(text){

const panel=

document.getElementById(

"achievementPanel"

);

if(!panel) return;

panel.innerHTML=

`

<div class="alert alert-success">

${text}

</div>

`;

}



// ==========================================
// THEMES
// ==========================================

function setTheme(color){

document.body.classList.remove(

"theme-blue",

"theme-green",

"theme-purple"

);

document.body.classList.add(

"theme-"+color

);

userProfile.theme=color;

saveProfile();

}



function loadTheme(){

setTheme(

userProfile.theme.toLowerCase()

);

}



// ==========================================
// HABIT TRACKER
// ==========================================

function habitProgress(){

const progress=

document.getElementById(

"habitProgress"

);

if(!progress) return;

progress.style.width=

dailyScore()+"%";

progress.innerHTML=

dailyScore()+"%";

}



// ==========================================
// INITIALIZE
// ==========================================

document.addEventListener(

"DOMContentLoaded",

function(){

renderProfile();

updateDailyScore();

habitProgress();

loadTheme();

checkAchievements();

updateStreak();

});



