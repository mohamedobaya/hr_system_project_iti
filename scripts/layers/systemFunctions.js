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
  console.log(getEmployeeByID(idealEmployee.id));
  return getEmployeeByID(idealEmployee.id);
};

// Task OverTime
document.querySelectorAll(".OverTime").forEach((input) => {
  const key = input.id.replace("settings-", "");
  const stored = JSON.parse(localStorage.getItem("overTimeQuota")) || {};

  if (stored[key] !== undefined) input.value = stored[key];

  input.addEventListener("input", () => {
    stored[key] = input.value;
    localStorage.setItem("overTimeQuota", JSON.stringify(stored));
  });
});

// Task leave
document.querySelectorAll(".TaskLeave").forEach((input) => {
  const key = input.id.replace("settings-", "");
  const stored = JSON.parse(localStorage.getItem("leaveQuota")) || {};
  if (stored[key] !== undefined) input.value = stored[key];

  input.addEventListener("change", () => {
    stored[key] = Number(input.value);
    localStorage.setItem("leaveQuota", JSON.stringify(stored));
  });
});
// Task Daily Deductions
document.querySelectorAll(".TaskQouta").forEach((input) => {
  const key = input.id.replace("settings-", "");
  const stored = JSON.parse(localStorage.getItem("taskQouta")) || {};
  if (stored[key] !== undefined) input.value = stored[key];

  input.addEventListener("change", () => {
    stored[key] = Number(input.value);
    localStorage.setItem("taskQouta", JSON.stringify(stored));
  });
});
