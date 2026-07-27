function exportExcel() {

    const data = todoList.map(task => ({
        Title: task.title,
        Description: task.description,
        Date: task.date,
        Priority: task.priority,
        Category: task.category,
        Status: task.completed ? "Completed" : "Pending"
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, "Tasks");

    XLSX.writeFile(wb, "TodoDashboard.xlsx");

}

function exportPDF() {

    const { jsPDF } = window.jspdf;

    const doc = new jsPDF();

    doc.setFontSize(18);

    doc.text("Todo Dashboard Report", 14, 20);

    const rows = todoList.map(task => [

        task.title,

        task.date,

        task.priority,

        task.category,

        task.completed ? "Completed" : "Pending"

    ]);

    doc.autoTable({

        head: [["Task", "Date", "Priority", "Category", "Status"]],

        body: rows,

        startY: 30

    });

    doc.save("TodoDashboard.pdf");

}

function backupJSON() {

    const blob = new Blob(

        [JSON.stringify(todoList, null, 2)],

        { type: "application/json" }

    );

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;

    a.download = "TodoBackup.json";

    a.click();

    URL.revokeObjectURL(url);

}

function importFile(event) {

    const file = event.target.files[0];

    if (!file) return;

    const ext = file.name.split(".").pop().toLowerCase();

    switch (ext) {

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

function importJSON(file) {

    const reader = new FileReader();

    reader.onload = function (e) {

        try {

            todoList = JSON.parse(e.target.result);

            saveTasks();

            refreshDashboard();

            showToast("JSON Imported");

        }

        catch {

            alert("Invalid JSON");

        }

    };

    reader.readAsText(file);

}

function importExcel(file) {

    const reader = new FileReader();

    reader.onload = function (e) {

        const workbook = XLSX.read(e.target.result, {

            type: "array"

        });

        const sheet = workbook.Sheets[workbook.SheetNames[0]];

        const rows = XLSX.utils.sheet_to_json(sheet);

        rows.forEach(row => {

            addImportedTask({

                id: generateID(),

                title: row.Title || "",

                description: row.Description || "",

                date: row.Date || "",

                priority: row.Priority || "Medium",

                category: row.Category || "General",

                completed: row.Status === "Completed",

                created: new Date().toISOString(),

                updated: new Date().toISOString()

            });

        });

        saveTasks();

        refreshDashboard();

    };

    reader.readAsArrayBuffer(file);

}

function importCSV(file) {

    const reader = new FileReader();

    reader.onload = function (e) {

        const rows = e.target.result.trim().split("\n");

        rows.shift();

        rows.forEach(line => {

            const col = line.split(",");

            if (col.length < 6) return;

            addImportedTask({

                id: generateID(),

                title: col[0],

                description: col[1],

                date: col[2],

                priority: col[3],

                category: col[4],

                completed: col[5] === "Completed",

                created: new Date().toISOString(),

                updated: new Date().toISOString()

            });

        });

        saveTasks();

        refreshDashboard();

    };

    reader.readAsText(file);

}

function addImportedTask(task) {

    const duplicate = todoList.find(t =>

        t.title === task.title &&

        t.date === task.date

    );

    if (!duplicate) {

        todoList.push(task);

    }

}

function deleteTask(id) {

    const index = todoList.findIndex(

        task => task.id === id

    );

    if (index === -1) return;

    deletedTasks.push(todoList[index]);

    todoList.splice(index, 1);

    saveTasks();

    refreshDashboard();

}

function restoreLastDeleted() {

    if (deletedTasks.length === 0) {

        alert("Recycle Bin Empty");

        return;

    }

    todoList.push(deletedTasks.pop());

    saveTasks();

    refreshDashboard();

}

function emptyRecycleBin() {

    if (confirm("Empty Recycle Bin?")) {

        deletedTasks = [];

    }

}

setInterval(() => {

    localStorage.setItem(

        "todoBackup",

        JSON.stringify(todoList)

    );

}, 60000);

function restoreBackup() {

    const backup = localStorage.getItem("todoBackup");

    if (!backup) return;

    todoList = JSON.parse(backup);

    saveTasks();

    refreshDashboard();

}

document.addEventListener("DOMContentLoaded", () => {

    const importFileInput = document.getElementById("importFile");

    if (importFileInput) {

        importFileInput.addEventListener(

            "change",

            importFile

        );

    }

});

document.addEventListener("DOMContentLoaded", () => {

    const dropZone = document.getElementById("dropZone");

    if (!dropZone) return;

    dropZone.addEventListener("dragover", e => {

        e.preventDefault();

        dropZone.classList.add("border-primary");

    });

    dropZone.addEventListener("dragleave", () => {

        dropZone.classList.remove("border-primary");

    });

    dropZone.addEventListener("drop", e => {

        e.preventDefault();

        dropZone.classList.remove("border-primary");

        if (e.dataTransfer.files.length) {

            importFile({

                target: {

                    files: e.dataTransfer.files

                }

            });

        }

    });

});

