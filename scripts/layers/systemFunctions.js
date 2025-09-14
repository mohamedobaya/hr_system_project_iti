import { getEmployeeByID } from "../components/reusableFunctions.js";

export const calculateIdealEmployee = (data) => {
  let getFirstEmployee = [];

  for (const emp of data.employees) {
    const attendance = data.attendanceRecords.filter(
      (r) => r.employeeId === emp.id && r.status === "Present"
    ).length;
    const completedTasks = data.tasks.filter(
      (t) => t.employeeId === emp.id && t.status === "Completed"
    ).length;
    const requestsMade = data.requests.filter(
      (r) => r.employeeId === emp.id
    ).length;

    getFirstEmployee.push({
      id: emp.id,
      attendance,
      completedTasks,
      requestsMade,
    });
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

  return getEmployeeByID(idealEmployee.id);
};

// Task OverTime
let overTimeStored = JSON.parse(localStorage.getItem("overTimeQuota")) || {};

document.querySelectorAll(".OverTime").forEach((input) => {
  const key = input.id.replace("settings-", "");

  if (overTimeStored[key] !== undefined) input.value = overTimeStored[key];

  input.addEventListener("change", () => {
    overTimeStored[key] = input.value;
    localStorage.setItem("overTimeQuota", JSON.stringify(overTimeStored));
  });
});

// Task leave
let leaveStored = JSON.parse(localStorage.getItem("leaveQuota")) || {};

document.querySelectorAll(".TaskLeave").forEach((input) => {
  const key = input.id.replace("settings-", "");

  if (leaveStored[key] !== undefined) input.value = leaveStored[key];

  input.addEventListener("change", () => {
    leaveStored[key] = Number(input.value);
    localStorage.setItem("leaveQuota", JSON.stringify(leaveStored));
  });
});

// Task Daily Deductions
let taskStored = JSON.parse(localStorage.getItem("taskQouta")) || {};

document.querySelectorAll(".TaskQouta").forEach((input) => {
  const key = input.id.replace("settings-", "");

  if (taskStored[key] !== undefined) input.value = taskStored[key];

  input.addEventListener("change", () => {
    taskStored[key] = Number(input.value);
    localStorage.setItem("taskQouta", JSON.stringify(taskStored));
  });
});
