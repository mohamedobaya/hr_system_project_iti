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

const createRow = (reqID) => {
    let req = getRequestByID(reqID);
    const emp = getEmployeeByID(req.employeeId);
    const department = emp.department;
    return `
    <tr>
        <th scope="row" id="employee-${req.id}">${emp.name}</th>
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
        const row = createRow(req.id);
        approvalTable.innerHTML += row;
    }

    console.log(Data.requests);
    localStorage.setItem("requests", JSON.stringify(Data.requests));   
}

// event-listenrs
// event-listners, for a request accept or reject
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("accept-req")) {
    approveRequest(e.target.dataset.id);
    
  }
  if (e.target.classList.contains("reject-req")) {
    rejectRequest(e.target.dataset.id);
  }
});

