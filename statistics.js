/* =====================================================
   PART 1C
   EDIT • PROGRESS • STATISTICS • TOAST
=====================================================*/

// ===========================================
// EDIT TASK
// ===========================================

function editTask(id) {

    const task = todoList.find(t => t.id === id);

    if (!task) return;

    taskInput.value = task.title;
    taskDescription.value = task.description;
    taskDate.value = task.date;
    prioritySelect.value = task.priority;
    categorySelect.value = task.category;

    addButton.innerHTML =
        '<i class="fa-solid fa-pen"></i> Update Task';

    addButton.onclick = function () {
        updateTask(id);
    };

}



// ===========================================
// UPDATE TASK
// ===========================================

function updateTask(id) {

    if (!validateTask()) return;

    const task = todoList.find(t => t.id === id);

    if (!task) return;

    task.title = taskInput.value.trim();
    task.description = taskDescription.value.trim();
    task.date = taskDate.value;
    task.priority = prioritySelect.value;
    task.category = categorySelect.value;
    task.updated = new Date().toISOString();

    saveTasks();

    clearForm();

    refreshDashboard();

    addButton.innerHTML =
        '<i class="fa-solid fa-plus"></i> Add Task';

    addButton.onclick = addTask;

    addLog("Task Updated : " + task.title);

    showToast("Task Updated Successfully");

}



// ===========================================
// PROGRESS BAR
// ===========================================

function updateProgress() {

    const total = todoList.length;

    const completed = todoList.filter(
        task => task.completed
    ).length;

    const percentage = total
        ? Math.round((completed / total) * 100)
        : 0;

    if (!progressBar) return;

    progressBar.style.width = percentage + "%";
    progressBar.innerHTML = percentage + "%";
    progressBar.setAttribute("aria-valuenow", percentage);

}



// ===========================================
// STATISTICS
// ===========================================

function updateStatistics() {

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const total = todoList.length;

    const completed = todoList.filter(
        task => task.completed
    ).length;

    const pending = total - completed;

    const overdue = todoList.filter(task => {

        if (task.completed) return false;

        const due = new Date(task.date);
        due.setHours(0, 0, 0, 0);

        return due < today;

    }).length;

    const high = todoList.filter(
        task => task.priority === "High"
    ).length;

    if (totalTasks) totalTasks.innerHTML = total;
    if (pendingTasks) pendingTasks.innerHTML = pending;
    if (completedTasks) completedTasks.innerHTML = completed;
    if (overdueTasks) overdueTasks.innerHTML = overdue;
    if (highPriority) highPriority.innerHTML = high;

    if (completionRate) {

        completionRate.innerHTML =
            total === 0
                ? "0%"
                : Math.round((completed / total) * 100) + "%";

    }

}



// ===========================================
// RESET DASHBOARD
// ===========================================

function resetDashboard() {

    if (!confirm("Delete every task?")) return;

    todoList = [];

    saveTasks();

    refreshDashboard();

    if (typeof updateReminderPanel === "function") {
        updateReminderPanel();
    }

    addLog("Dashboard Reset");

    showToast("Dashboard Reset");

}



// ===========================================
// TOAST
// ===========================================

function showToast(message) {

    const body = document.getElementById("toastMessage");
    const toastElement = document.getElementById("liveToast");

    if (!body || !toastElement) return;

    body.innerHTML = message;

    const toast = new bootstrap.Toast(toastElement);

    toast.show();

}



// ===========================================
// ACTIVITY LOG
// ===========================================

function addLog(text) {

    const log = document.getElementById("logList");

    if (!log) return;

    const li = document.createElement("li");

    li.innerHTML =
        new Date().toLocaleString() +
        "<br>" +
        text;

    log.prepend(li);

}



// ===========================================
// SAVE BEFORE EXIT
// ===========================================

window.addEventListener("beforeunload", function () {

    saveTasks();

});



// ===========================================
// INITIALIZE
// ===========================================

document.addEventListener("DOMContentLoaded", function () {

    loadTasks();

    refreshDashboard();

});
