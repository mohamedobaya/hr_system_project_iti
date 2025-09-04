// Function to load data from localStorage
import { getNavbar } from "./navbar.js";
import { getProfile } from "./profile.js";
import { calculateIdealEmployee } from "../layers/systemFunctions.js";

const url = "./server/server.json";
const navbar = document.getElementById("navbar-elm");
const profile = document.getElementById("profile");

export const onPageLoad = (loggedEmployee) => {

    // check if logged-in
    if (loggedEmployee == undefined) {
        window.location.href = "/pages/index.html";
    }

    // navbar-logic
    navbar.innerHTML = getNavbar(loggedEmployee.role, loggedEmployee.name, loggedEmployee.preferences.theme);

    // profile-logic
    profile.innerHTML = getProfile(loggedEmployee);

    // theme-logic (light/dark)
    const themeBtn = document.getElementById("btn-theme");

    // theme button logic
    const enableDarkmode = () => {
        document.body.classList.add('darkmode');
    }

    const disableDarkmode = () => {
        document.body.classList.remove('darkmode');
    }

    if (loggedEmployee.preferences.theme == 'dark')
        enableDarkmode();
    else
        disableDarkmode();

    themeBtn.addEventListener('click', () => {
        if (loggedEmployee.preferences.theme == 'light') {
            loggedEmployee.preferences.theme = 'dark';
            localStorage.setItem("employees", JSON.stringify(updateEmployeeByTheme(loggedEmployee.id, 'dark')));
            enableDarkmode();
            onPageLoad(loggedEmployee);
        } else {
            loggedEmployee.preferences.theme = 'light';
            localStorage.setItem("employees", JSON.stringify(updateEmployeeByTheme(loggedEmployee.id, 'light')));
            disableDarkmode();
            onPageLoad(loggedEmployee);
        }
    });
    calculateIdealEmployee(loadDataFromStorage());

    // localStorage.getItem("employees");
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

export const updateEmployeeByTheme = (empID, newTheme) => {
    const employees = JSON.parse(localStorage.getItem("employees") || "[]");
    let updatedEmployees = [];
    for (let emp of employees) {
        if (emp.id == empID)
            emp.preferences.theme = newTheme;
        updatedEmployees.push(emp);
    }

    return updatedEmployees;
}

export const searchArrays = (array, keyword) => {
    keyword.toLowerCase();

    return array.filter(item =>
        item.toLowerCase().startsWith(keyword)
    );
}

export const searchEmployeeByName = (keyword) => {
    keyword = keyword.toLowerCase();
    const employees = JSON.parse(localStorage.getItem("employees") || "[]");

    return employees.filter(emp =>
        emp.name.toLowerCase().startsWith(keyword)
    );
}

export const searchEmployeeByDepartment = (keyword) => {
    keyword = keyword.toLowerCase();
    const employees = JSON.parse(localStorage.getItem("employees") || "[]");

    return employees.filter(emp =>
        emp.department.toLowerCase().startsWith(keyword.toLowerCase())
    );
}

export const searchRequestByEmployeeName = (keyword) => {
    keyword = keyword.toLowerCase();
    const requests = JSON.parse(localStorage.getItem("requests") || "[]");

    return requests.filter(req => {
        const emp = getEmployeeByID(req.employeeId);
        if (emp.name.toLowerCase().startsWith(keyword.toLowerCase()))
            return req;
    });
}

export const searchRequestByEmployeeDepartment = (keyword) => {
    keyword = keyword.toLowerCase();
    const requests = JSON.parse(localStorage.getItem("requests") || "[]");

    return requests.filter(req => {
        const emp = getEmployeeByID(req.employeeId);
        if (emp.department.toLowerCase().startsWith(keyword.toLowerCase()))
            return req;
    });
}

export const searchAttendanceByEmployeeName = (keyword) => {
    keyword = keyword.toLowerCase();
    const attendanceRecords = JSON.parse(localStorage.getItem("attendanceRecords") || "[]");

    return attendanceRecords.filter(ar => {
        const emp = getEmployeeByID(ar.employeeId);
        if (emp.name.toLowerCase().startsWith(keyword.toLowerCase()))
            return ar;
    });
}

export const searchAttendanceByEmployeeDepartment = (keyword) => {
    keyword = keyword.toLowerCase();
    const attendanceRecords = JSON.parse(localStorage.getItem("attendanceRecords") || "[]");

    return attendanceRecords.filter(ar => {
        const emp = getEmployeeByID(ar.employeeId);
        if (emp.department.toLowerCase().startsWith(keyword.toLowerCase()))
            return ar;
    });
}

export const searchTaskByEmployeeName = (tasks, keyword) => {
    keyword = keyword.toLowerCase();

    return tasks.filter(task => {
        const emp = getEmployeeByID(task.employeeId);
        if (emp.name.toLowerCase().startsWith(keyword.toLowerCase()))
            return task;
    });
}

export const searchTaskByEmployeeDepartment = (tasks, keyword) => {
    keyword = keyword.toLowerCase();
    return tasks.filter(task => {
        const emp = getEmployeeByID(task.employeeId);
        if (emp.department.toLowerCase().startsWith(keyword.toLowerCase()))
            return task;
    });
}

export const filterTasksByPriorities = (tasks, priority) => {

    if (priority == 5)
        return tasks;

    return tasks.filter(task => task.priority == Number(priority));
}


// remove task by id
export const removeTaskByID = (tasks, taskID) => {
    return tasks.filter(task => task.id != taskID);
}

// get task number by employees
export const getTaskLoad = (tasks, empID) => {
    return tasks.reduce((acc, task) => {
        if (task.employeeId == empID)
            acc += 1;
        return acc;
    }, 0);
}