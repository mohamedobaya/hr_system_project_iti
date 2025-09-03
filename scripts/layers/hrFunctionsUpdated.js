import { paginationEnable } from "../components/pagination.js";
import { loadDataFromStorage, onPageLoad, searchAttendanceByEmployeeDepartment, searchAttendanceByEmployeeName, searchRequestByEmployeeDepartment, searchRequestByEmployeeName, searchTaskByEmployeeName, searchTaskByEmployeeDepartment, filterTasksByPriorities } from "../components/reusableFunctions.js";
import { getEmployeeByID, getRequestByID, updateRequestByStatus, getAttendanceRecordsByID, getTaskByID } from "../components/reusableFunctions.js";
import { searchEmployeeByName, searchEmployeeByDepartment } from "../components/reusableFunctions.js";

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

});