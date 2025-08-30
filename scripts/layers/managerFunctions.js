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

const acceptRequest = (reqID) => {
    let req = getRequestByID(reqID);
    // TODO: accept logic
    console.log(req.id, req.employeeId);
}

const rejectRequest = (reqID) => {
    let req = getRequestByID(reqID);
    // TODO: accept logic
    console.log(req.id, req.employeeId);
}

const createRow = (reqID) => {
    let req = getRequestByID(reqID);
    const emp = getEmployeeByID(req.employeeId);
    const department = emp.department;
    return `
    <tr>
        <th scope="row">${emp.name}</th>
        <td>${req.type}</td>
        <td>${req.date}</td>
        <td>${req.notes}</td>
        <td>${req.status}</td>
        <td>
            <textarea name="" id=""></textarea>
        </td>
        <td>
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
    for (let req of Data.requests) {
        const row = createRow(req.id);
        approvalTable.innerHTML += row;
    }
}

// event-listenrs
// event-listners, for a request accept or reject
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("accept-req")) {
    acceptRequest(e.target.dataset.id);
    
  }
  if (e.target.classList.contains("reject-req")) {
    rejectRequest(e.target.dataset.id);
  }
});

