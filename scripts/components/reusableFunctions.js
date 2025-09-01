// Function to load data from localStorage
import { getNavbar } from "./navbar.js";

const url = "./server/server.json";
const navbar = document.getElementById("navbar-elm");

export const onPageLoad = (loggedEmployee) => {
    
    // check if logged-in
    if (loggedEmployee == undefined) {
        window.location.href = "/pages/index.html";
    }

    // navbar-logic
    navbar.innerHTML = getNavbar(loggedEmployee.role, loggedEmployee.name, loggedEmployee.preferences.theme);


    // theme-logic (light/dark)
    const themeBtn = document.getElementById("btn-theme");

    // theme button logic
    const enableDarkmode = () => {
        document.body.classList.add('darkmode');
    }

    const disableDarkmode = () => {
        document.body.classList.remove('darkmode');
    }
    themeBtn.addEventListener('click', () => {
        if (loggedEmployee.preferences.theme == 'light') {
            loggedEmployee.preferences.theme = 'dark';
            enableDarkmode();
        } else {
            loggedEmployee.preferences.theme = 'light';
            disableDarkmode();
        }
    });
}


export const loadDataFromStorage = () => {
    let data = {
        employees: [],
        attendanceRecords: [],
        tasks: [],
        requests: [],
        payrolls: []
    };

    data.employees = JSON.parse(localStorage.getItem("employees") || '[]');
    data.attendanceRecords = JSON.parse(localStorage.getItem("attendanceRecords") || '[]');
    data.tasks = JSON.parse(localStorage.getItem("tasks") || '[]');
    data.requests = JSON.parse(localStorage.getItem("requests") || '[]');
    data.payrolls = JSON.parse(localStorage.getItem("payrolls") || '[]');

    return data;
}

export const getEmployeeByID = (empID) => {
    const employees = JSON.parse(localStorage.getItem("employees") || "[]");
    return employees.filter(emp => emp.id == empID)[0];
}

export const getRequestByID = (reqID) => {
    const requests = JSON.parse(localStorage.getItem("requests") || "[]");
    return requests.filter(req => req.id == reqID)[0];
}

export const getAttendanceRecordsByID = (arID) => {
    const attendanceRecords = JSON.parse(localStorage.getItem("attendanceRecords") || "[]");
    return attendanceRecords.filter(ar => ar.id == arID)[0];
}

export const getTaskByID = (taskID) => {
    const tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
    return tasks.filter(task => task.id == taskID)[0];
}

export const updateRequestByStatus = (reqID, newStatus) => {
    const requests = JSON.parse(localStorage.getItem("requests") || "[]");
    let updatedRequests = [];
    for (let req of requests) {
        if (req.id == reqID) 
            req.status = newStatus;

        updatedRequests.push(req);
    }

    // localStorage.setItem("requests", JSON.stringify(requests));
    return updatedRequests;
}

export const searchEmployeesByName = () => {
    
}