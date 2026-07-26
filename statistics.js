
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

