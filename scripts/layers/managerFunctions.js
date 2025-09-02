import { paginationEnable } from "../components/pagination.js";
import { loadDataFromStorage, onPageLoad } from "../components/reusableFunctions.js";
import { getEmployeeByID, getRequestByID, updateRequestByStatus, getAttendanceRecordsByID, getTaskByID } from "../components/reusableFunctions.js";


let Data = {
    employees: [],
    attendanceRecords: [],
    tasks: [],
    requests: [],
    payrolls: []
};
let loggedEmployee = {}

// automatically load when window is ready
window.addEventListener("load", async () => {
    Data = await loadDataFromStorage();
    loggedEmployee = getEmployeeByID(localStorage.getItem("loggedEmployeeID"));
    onPageLoad(loggedEmployee);
    
    // role-based call functions
    loadApprovalTable();
    loadAttendanceTable();
    loadTaskTable();
    loadAssignTaskForm();
});

// Approval Center logic
const approveRequest = (reqID) => {
    Data.requests = updateRequestByStatus(reqID, "Approved");
    localStorage.setItem("requests", JSON.stringify(Data.requests));
    loadApprovalTable();
}

const rejectRequest = (reqID) => {
    Data.requests = updateRequestByStatus(reqID, "Rejected");
    localStorage.setItem("requests", JSON.stringify(Data.requests));
    loadApprovalTable();
}

const createApprovalRow = (reqID) => {
    let req = getRequestByID(reqID);
    const emp = getEmployeeByID(req.employeeId);

    return `
    <tr>
        <td scope="row" id="employee-${req.id}">${emp.name}</td>
        <td id="department-${req.id}">${emp.department}</td>
        <td id="type-${req.id}">${req.type}</td>
        <td id="date-${req.id}">${req.date}</td>
        <td id="notes-${req.id}">${req.notes}</td>
        <td id="status-${req.id}">${req.status}</td>
        <td id="btns-${req.id}">
            <div class="manager-btns">
                <a class="btn btn-success accept-req my-1" data-id='${reqID}'>accept</a>
                <a class="btn btn-danger reject-req my-1" data-id='${reqID}'>reject</a>
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
    // console.log(Data.requests);
    localStorage.setItem("requests", JSON.stringify(Data.requests));
    paginationEnable("pagination-approval", "approval-table", 5);
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
        <td scope="row" id="employee-${attendanceRecordID.id}">${emp.name}</td>
        <td id="department-${attendanceRecord.id}">${emp.department}</td>
        <td id="date-${attendanceRecord.id}">${attendanceRecord.date}</td>
        <td id="checkIn-${attendanceRecord.id}">${attendanceRecord.checkIn}</td>
        <td id="checkOut-${attendanceRecord.id}">${attendanceRecord.checkOut}</td>
        <td id="status-${attendanceRecord.id}">${attendanceRecord.status}</td>
        <td id="minutesLate-${attendanceRecord.id}">${attendanceRecord.minutesLate}</td>
        <td id="isWFH-${attendanceRecord.id}">${attendanceRecord.isWFH ? "Work from Home" : "Office"}</td>
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
    paginationEnable("pagination-attendance", "attendance-table", 10);
}

// Task Center logic
const creatTaskRow = (taskID) => {
    let task = getTaskByID(taskID);

    const emp = getEmployeeByID(task.employeeId);

    return `
    <tr>
        <td scope="row" id="task-${taskID}">${task.id}</td>
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
    paginationEnable("pagination-task", "task-table", 10);
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
        Data.tasks.push(newTask);
        localStorage.setItem("tasks", JSON.stringify(Data.tasks));
        // reload Task Center
        loadTaskTable();
        // alert that a new task have been assigned
        const selectedEmployee = getEmployeeByID(employeeSelector.value);
        alert(`Task assigned to ${selectedEmployee.name} successfully!`);
    });
}

