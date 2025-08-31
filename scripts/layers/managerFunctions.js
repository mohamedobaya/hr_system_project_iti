import { getNavbar } from "../components/navbar.js";

const url = "./server/server.json";
const navbar = document.getElementById("navbar-elm");
const Data = {
    employees: [],
    attendanceRecords: [],
    tasks: [],
    requests: [],
    payrolls: []
};
let loggedEmployee = {}

// automatically load when window is ready
window.addEventListener("load", async () => {
    loadDataFromStorage();
    loggedEmployee = getEmployeeByID(localStorage.getItem("loggedEmployeeID"));
    if (loggedEmployee == undefined) {
        window.location.href = "/pages/index.html";
    }
    navbar.innerHTML = getNavbar(loggedEmployee.role, loggedEmployee.name, loggedEmployee.preferences.theme);

    loadApprovalTable();
    loadAttendanceTable();
    loadTaskTable();
    loadAssignTaskForm();
});


// Function to load data from localStorage
const loadDataFromStorage = () => {
    Data.employees = JSON.parse(localStorage.getItem("employees") || '[]');
    Data.attendanceRecords = JSON.parse(localStorage.getItem("attendanceRecords") || '[]');
    Data.tasks = JSON.parse(localStorage.getItem("tasks") || '[]');
    Data.requests = JSON.parse(localStorage.getItem("requests") || '[]');
    Data.payrolls = JSON.parse(localStorage.getItem("payrolls") || '[]');
    console.log("Loaded Data in managerFunctions.js:", Data);
}

const getEmployeeByID = (empID) => {
    return Data.employees.filter(emp => emp.id == empID)[0];
}

const getRequestByID = (reqID) => {
    return Data.requests.filter(req => req.id == reqID)[0];
}

const getAttendanceRecordsByID = (arID) => {
    return Data.attendanceRecords.filter(ar => ar.id == arID)[0];
}

const getTaskByID = (taskID) => {
    return Data.tasks.filter(task => task.id == taskID)[0];
}

// Approval Center logic
const approveRequest = (reqID) => {
    let req = getRequestByID(reqID);
    // TODO: accept logic
    req.status = "Approved";
    console.log(req);
    loadApprovalTable();
}

const rejectRequest = (reqID) => {
    let req = getRequestByID(reqID);
    // TODO: reject logic
    req.status = "Rejected";
    console.log(req);
    loadApprovalTable();
}

const createApprovalRow = (reqID) => {
    let req = getRequestByID(reqID);
    const emp = getEmployeeByID(req.employeeId);
    const department = emp.department;
    return `
    <tr>
        <th scope="row" id="employee-${req.id}">${emp.name}</th>
        <td id="department-${req.id}">${emp.department}</td>
        <td id="type-${req.id}">${req.type}</td>
        <td id="date-${req.id}">${req.date}</td>
        <td id="notes-${req.id}">${req.notes}</td>
        <td id="status-${req.id}">${req.status}</td>
        <td id="btns-${req.id}">
            <div class="manager-btns d-flex">
                <a class="btn btn-success accept-req me-1" data-id='${reqID}'>accept</a>
                <a class="btn btn-danger reject-req ms-1" data-id='${reqID}'>reject</a>
            </div>
        </td>
    </tr>
    `;
}

const loadApprovalTable = () => {
    const approvalTable = document.getElementById("approval-table");
    approvalTable.innerHTML = "";
    for (let req of Data.requests) {
        const row = createApprovalRow(req.id);
        approvalTable.innerHTML += row;
    }

    console.log(Data.requests);
    localStorage.setItem("requests", JSON.stringify(Data.requests));
}

document.addEventListener("click", (e) => {
    if (e.target.classList.contains("accept-req")) {
        approveRequest(e.target.dataset.id);

    }
    if (e.target.classList.contains("reject-req")) {
        rejectRequest(e.target.dataset.id);
    }
});

// Attendance Center logic
const createAttendancelRow = (attendanceRecordID) => {
    let attendanceRecord = getAttendanceRecordsByID(attendanceRecordID);
    // console.log(attendanceRecord);

    const emp = getEmployeeByID(attendanceRecord.employeeId);
    // console.log(emp);

    return `
    <tr>
        <th scope="row" id="employee-${attendanceRecordID.id}">${emp.name}</th>
        <td id="department-${attendanceRecord.id}">${emp.department}</td>
        <td id="date-${attendanceRecord.id}">${attendanceRecord.date}</td>
        <td id="checkIn-${attendanceRecord.id}">${attendanceRecord.checkIn}</td>
        <td id="checkOut-${attendanceRecord.id}">${attendanceRecord.checkOut}</td>
        <td id="status-${attendanceRecord.id}">${attendanceRecord.status}</td>
        <td id="minutesLate-${attendanceRecord.id}">${attendanceRecord.minutesLate}</td>
        <td id="isWFH-${attendanceRecord.id}">${attendanceRecord.isWFH}</td>
        <td id="isLeave-${attendanceRecord.id}">${attendanceRecord.isLeave}</td>
        <td id="notes-${attendanceRecord.id}">${attendanceRecord.notes}</td>
    </tr>
    `;
}

const loadAttendanceTable = () => {
    const attendanceTable = document.getElementById("attendance-table");
    attendanceTable.innerHTML = "";
    for (let ar of Data.attendanceRecords) {
        const row = createAttendancelRow(ar.id);
        attendanceTable.innerHTML += row;
    }

    console.log(Data.attendanceRecords);
    // localStorage.setItem("attendanceRecords", JSON.stringify(Data.attendanceRecords));   
}

// Task Center logic
const creatTaskRow = (taskID) => {
    let task = getTaskByID(taskID);
    console.log(task);

    const emp = getEmployeeByID(task.employeeId);
    console.log(emp);

    return `
    <tr>
        <th scope="row" id="task-${taskID}">${task.id}</th>
        <td id="title-${taskID}">${task.title}</td>
        <td id="description-${taskID}">${task.description}</td>
        <td id="employee-${taskID}">${emp.name}</td>
        <td id="department-${taskID}">${emp.department}</td>
        <td id="status-${taskID}">${task.status}</td>
        <td id="dueDate-${taskID}">${task.dueDate}</td>
    </tr>
    `;
}

const loadTaskTable = () => {
    const taskTable = document.getElementById("task-table");
    taskTable.innerHTML = "";
    for (let task of Data.tasks) {
        const row = creatTaskRow(task.id);
        taskTable.innerHTML += row;
    }

    console.log(Data.tasks);
}

// Assign New Tasks
const loadAssignTaskForm = () => {
    // const form = document.getElementById("manager-assign");
    const employeeSelector = document.getElementById("employee-assign-task-selector");
    const newTaskTitle = document.getElementById("new-task-title");
    const newTaskDescription = document.getElementById("new-task-description");
    const newTaskDate = document.getElementById("new-task-date");
    const assignTaskBtn = document.getElementById("assign-task-btn");

    // employee-selector logic
    Data.employees.forEach(emp => {
        const option = document.createElement("option");
        option.value = emp.id;
        option.textContent = emp.name;
        employeeSelector.appendChild(option);
    })

    // date base logic
    const today = new Date().toISOString().split("T")[0];
    newTaskDate.value = today;
    newTaskDate.min = today;

    // assign-btn logic
    assignTaskBtn.addEventListener('click', () => {
        // simple validation
        if (!employeeSelector.value) {
            alert("Please select an employee.");
            return;
        }
        if (!newTaskTitle.value) {
            alert("Please enter a task title.");
            return;
        }
        if (!newTaskDescription.value) {
            alert("Please enter a task description.");
            return;
        }
        if (!newTaskDate.value) {
            alert("Please select a due date.");
            return;
        }
        
        // collect task data
        const newTask = {
            id: Data.tasks.length + 1,
            employeeId: employeeSelector.value,
            title: newTaskTitle.value,
            description: newTaskDescription.value,
            status: "Pending",
            dueDate: newTaskDate.value
        };

        // save to local storage
        console.log("Task assigned:", newTask);
        Data.tasks.push(newTask);
        localStorage.setItem("tasks", JSON.stringify(Data.tasks));
        // reload Task Center
        loadTaskTable();
        // alert that a new task have been assigned
        const selectedEmployee = getEmployeeByID(employeeSelector.value);
        alert(`Task assigned to ${selectedEmployee.name} successfully!`);
    });
}