const url = "../server/server.json";

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
    await loadToLocalStorage(); // store default data from server.json to local-storage 
    sotreDataRunTime(); // storing data for run-time usage

});


const loadToLocalStorage = async () => {
    // clearing local-storage
    localStorage.clear(); 
    // storing employees data in local-storage
    localStorage.setItem("employees", JSON.stringify(
        await loadEmployees()
    ));
    // storing employees data in local-storage
    localStorage.setItem("attendanceRecords", JSON.stringify(
        await loadAttendanceRecords()
    ));
    // storing employees data in local-storage
    localStorage.setItem("tasks", JSON.stringify(
        await loadTasks()
    ));
    // storing employees data in local-storage
    localStorage.setItem("requests", JSON.stringify(
        await loadRequests()
    ));
    // storing employees data in local-storage
    localStorage.setItem("payrolls", JSON.stringify(
        await loadPayrolls()
    ));
}

const sotreDataRunTime = () => {
    Data.employees = JSON.parse(localStorage.getItem("employees"));
    Data.attendanceRecords = JSON.parse(localStorage.getItem("attendanceRecords"));
    Data.tasks = JSON.parse(localStorage.getItem("tasks"));
    Data.requests = JSON.parse(localStorage.getItem("requests"));
    Data.payrolls = JSON.parse(localStorage.getItem("payrolls"));
    console.log(Data.employees);
};

const loadEmployees = async () => {
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data.employees;
    } catch (error) {
        console.error("Error loading employees:", error);
        return [];
    }
};

const loadAttendanceRecords = async () => {
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data.attendanceRecords;
    } catch (error) {
        console.error("Error loading attendance records:", error);
        return [];
    }
};

const loadTasks = async () => {
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data.tasks;
    } catch (error) {
        console.error("Error loading attendance records:", error);
        return [];
    }
}

const loadRequests = async () => {
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data.requests;
    } catch (error) {
        console.error("Error loading attendance records:", error);
        return [];
    }
}

const loadPayrolls = async () => {
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data.payrolls;
    } catch (error) {
        console.error("Error loading attendance records:", error);
        return [];
    }
}

const getEmployeeByID = (empID) => {
    return Data.employees.filter(emp => emp.id == empID)[0];
}

const getEmployeeByLogin = (empUsername, empPassword) => {
    return Data.employees.filter(emp => (emp.username == empUsername && emp.password == empPassword))[0];
}

document.getElementById("loginForm").addEventListener("submit", function (event) {
    event.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const emp = getEmployeeByLogin(username, password);
    console.log(emp);


    if (emp) {
        alert(`Welcome ${emp.username}! Logged in as ${emp.role}.`);
        localStorage.setItem("loggedEmployeeID", emp.id);
        // loggedEmployee = emp;
        // Redirect based on role
        switch (emp.role) {
            case "Employee":
                window.location.href = "/pages/layers/employee.html";
                break;
            case "Manager":
                window.location.href = "/pages/layers/manager.html";
                break;
            case "Security":
                window.location.href = "/pages/layers/security.html";
                break;
            case "HR":
                window.location.href = "/pages/layers/hr.html";
                break;
            default:
                alert("Please select a valid role!");
        }
    } else {
        alert(`Wrong username or password.`);
    }


});

export { Data, loggedEmployee };