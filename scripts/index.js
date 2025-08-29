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

export {Data};