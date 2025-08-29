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
    navbar.innerHTML = getNavbar(loggedEmployee.role, loggedEmployee.name);    
});


// Function to load data from localStorage
const loadDataFromStorage = () => {
    Data.employees = JSON.parse(localStorage.getItem("employees") || '[]');
    Data.attendanceRecords = JSON.parse(localStorage.getItem("attendanceRecords") || '[]');
    Data.tasks = JSON.parse(localStorage.getItem("tasks") || '[]');
    Data.requests = JSON.parse(localStorage.getItem("requests") || '[]');
    Data.payrolls = JSON.parse(localStorage.getItem("payrolls") || '[]');
    console.log("Loaded Data in securityFunctions.js:", Data);
}

const getEmployeeByID = (empID) => {
    return Data.employees.filter(emp => emp.id == empID)[0];
}

