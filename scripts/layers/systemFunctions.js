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

// let bonusWorkdayValue = document.getElementById("bonus-workday").value;
// let bonusHolidayValue = document.getElementById("bonus-holiday").value;
// let settingHoliday1 = document.getElementById("settings-holiday1").value;
// let settingHoliday2 = document.getElementById("settings-holiday2").value;
// let leaveSettings1 = document.getElementById("late-1").value;
// let leaveSettings2 = document.getElementById("late-2").value;
// let leaveSettings3 = document.getElementById("late-3").value;
// let leaveSettings4 = document.getElementById("late-4").value;
// let maxMonthDeduction = document.getElementById("max-month-deduction").value;
// let taskSettingsLow = document.getElementById("settings-low").value;
// let taskSettingsMedium = document.getElementById("settings-medium").value;
// let taskSettingsHigh = document.getElementById("settings-High").value;
// let taskSettingsCritical = document.getElementById("settings-critical").value;

// function updatePayrollImpact() {
//     bonusWorkdayValue = Number(document.getElementById("bonus-workday").value) || 0;
//     bonusHolidayValue = Number(document.getElementById("bonus-holiday").value) || 0;
//     settingHoliday1 = Number(document.getElementById("settings-holiday1").value) || 0;
//     settingHoliday2 = Number(document.getElementById("settings-holiday2").value) || 0;

//     leaveSettings1 = Number(document.getElementById("late-1").value) || 0;
//     leaveSettings2 = Number(document.getElementById("late-2").value) || 0;
//     leaveSettings3 = Number(document.getElementById("late-3").value) || 0;
//     leaveSettings4 = Number(document.getElementById("late-4").value) || 0;
//     maxMonthDeduction = Number(document.getElementById("max-month-deduction").value) || 0;

//     taskSettingsLow = Number(document.getElementById("settings-low").value) || 0;
//     taskSettingsMedium = Number(document.getElementById("settings-medium").value) || 0;
//     taskSettingsHigh = Number(document.getElementById("settings-High").value) || 0;
//     taskSettingsCritical = Number(document.getElementById("settings-critical").value) || 0;
// }

// function updatePayrollByTaskId(taskId, employeeId, payrolls, tasks, baseSalary) {
//     updatePayrollImpact();

//     const task = tasks.find((t) => t.id === taskId);
//     if (!task) {
//         console.log("Task not found:", taskId);
//         return;
//     }

//     const payrollEmployee = payrolls.find(
//         (p) => p.employeeId === employeeId && p.month === "2025-9"
//     );
//     if (!payrollEmployee) {
//         console.log("Payroll employee not found for employeeId:", employeeId);
//         return;
//     }

//     if (typeof payrollEmployee.deductions !== "number") payrollEmployee.deductions = 0;
//     if (typeof payrollEmployee.netSalary !== "number") payrollEmployee.netSalary = baseSalary;

//     const today = new Date();
//     const taskDate = new Date(task.date);

//     if (task.status !== "completed" && today > taskDate) {
//         if (task.priority === "low") {
//             payrollEmployee.deductions += baseSalary / 30 + taskSettingsLow;
//         } else if (task.priority === "medium") {
//             payrollEmployee.deductions += baseSalary / 30 + taskSettingsMedium;
//         } else if (task.priority === "high") {
//             payrollEmployee.deductions += baseSalary / 30 + taskSettingsHigh;
//         } else if (task.priority === "critical") {
//             payrollEmployee.deductions += baseSalary / 30 + taskSettingsCritical;
//         }
//     }

//     payrollEmployee.netSalary = baseSalary - payrollEmployee.deductions + bonusWorkdayValue + bonusHolidayValue;

//     localStorage.setItem("payrolls", JSON.stringify(payrolls));
// }




// function updatePayrollByOverTime(attendanceId, employeeId) {

// }
// function updatePayrollByLeave(attendanceId, employeeId) {
// }
// function updatePatrollByAbsent (attendanceId, employeeId) {

// }
// function updatePayrollByLate (attendanceId, employeeId) {

// }
