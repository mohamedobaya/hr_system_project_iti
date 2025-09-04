import { getEmployeeByID } from "../components/reusableFunctions.js";
export const calculateIdealEmployee = (data) => {
    let getFirstEmployee = [];

    for (const emp of data.employees) {
        const attendance = data.attendanceRecords.filter(r => r.employeeId === emp.id && r.status === "Present").length
        const completedTasks = data.tasks.filter(t => t.employeeId === emp.id && t.status === "Completed").length
        const requestsMade = data.requests.filter(r => r.employeeId === emp.id).length;

        getFirstEmployee.push({ id: emp.id, attendance, completedTasks, requestsMade });
    }

    let idealEmployee = getFirstEmployee[0];

    for (const emp of getFirstEmployee) {
        if (
            emp.attendance >= idealEmployee.attendance &&
            emp.completedTasks >= idealEmployee.completedTasks &&
            emp.requestsMade <= idealEmployee.requestsMade
        ) {
            idealEmployee = emp;
        }
    }
    console.log(getEmployeeByID(idealEmployee.id));
    return getEmployeeByID(idealEmployee.id);
};


// Task Daily Deductions 
document.querySelectorAll('.TaskQouta').forEach(input => {
    const key = input.id.replace("settings-", "");
    const stored = JSON.parse(localStorage.getItem("taskQueue")) || {};
    if (stored[key] !== undefined) input.value = stored[key];

    input.addEventListener("input", () => {
        stored[key] = Number(input.value);
        localStorage.setItem("taskQueue", JSON.stringify(stored));
    });
});
