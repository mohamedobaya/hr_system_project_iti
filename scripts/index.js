const url = "../server/server.json";

const Data = {
    employees: [],
    attendanceRecords: [],
    tasks: [],
    requests: [],
    payrolls: []
};

// automatically load when window is ready
window.addEventListener("load", async () => {
    await loadData();
    console.log(getEmployeeByID(1));

    // console.log("loaded employees", Data.employees);
    // console.log("loaded attendanceRecords", Data.attendanceRecords);
    // console.log("loaded tasks", Data.tasks);
    // console.log("loaded requests", Data.requests);
    // console.log("loaded payrolls", Data.payrolls);

    // console.log(Data);
});

const loadData = async () => {
    Data.employees = await loadEmployees();
    Data.attendanceRecords = await loadAttendanceRecords();
    Data.tasks = await loadTasks();
    Data.requests = await loadRequests();
    Data.payrolls = await loadPayrolls();
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

    const emp = getEmployeeByID(username, password);
    console.log(emp);

    if (emp) {
        alert(`Welcome ${emp.username}! Logged in as ${emp.role}.`);
        // Redirect based on role
        switch (role) {
            case "Employee":
                window.location.href = "employee.html";
                break;
            case "Manager":
                window.location.href = "manager.html";
                break;
            case "Security":
                window.location.href = "security.html";
                break;
            case "HR":
                window.location.href = "hr.html";
                break;
            default:
                alert("Please select a valid role!");
        }
    } else {
        alert(`Wrong username or password.`);
    }


});

export { Data };