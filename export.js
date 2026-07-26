
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

