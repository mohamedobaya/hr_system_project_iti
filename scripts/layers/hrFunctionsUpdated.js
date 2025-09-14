import {
  loadDataFromStorage,
  onPageLoad,
} from "../components/reusableFunctions.js";
import {
  getEmployeeByID,
  getRequestByID,
  updateRequestByStatus,
  getAttendanceRecordsByID,
  getTaskByID,
} from "../components/reusableFunctions.js";
import { paginationEnable } from "../components/pagination.js";
import { getProfile } from "../components/profile.js";
import { calculateIdealEmployee } from "./systemFunctions.js";

let Data = {
  employees: [],
  attendanceRecords: [],
  tasks: [],
  requests: [],
  payrolls: [],
};
let loggedEmployee = {};

const employeeTableBody = document.getElementById("employee-table-body");
const searchInput = document.getElementById("searchInput");

const reportTableBody = document.getElementById("reportTableBody");
const filterDepartment = document.getElementById("filterDepartment");
const filterMonth = document.getElementById("filterMonth");
const filterStatus = document.getElementById("filterStatus");
const exportExcelBtn = document.getElementById("exportExcel");
const exportPDFBtn = document.getElementById("exportPDF");

const getIdealEmployeeByID = document.getElementById("ideal-Employee");

window.addEventListener("load", async () => {
  Data = await loadDataFromStorage();
  loggedEmployee = getEmployeeByID(localStorage.getItem("loggedEmployeeID"));
  onPageLoad(loggedEmployee);

  updateEmployeeStatusAndLeaveBalance();
  renderEmployeeTable();
  setupReportsSection();
  getIdealEmployeeByID.innerHTML = getProfile(calculateIdealEmployee(Data));

  searchInput.addEventListener("keyup", renderEmployeeTable);
});

const saveDataToStorage = () => {
  localStorage.setItem("employees", JSON.stringify(Data.employees));
  localStorage.setItem(
    "attendanceRecords",
    JSON.stringify(Data.attendanceRecords)
  );
  localStorage.setItem("tasks", JSON.stringify(Data.tasks));
  localStorage.setItem("requests", JSON.stringify(Data.requests));
  localStorage.setItem("payrolls", JSON.stringify(Data.payrolls));
};

const updateEmployeeStatusAndLeaveBalance = () => {
  Data.employees.forEach((emp) => {
    if (emp.leaveBalanceAdjustment === undefined) {
      emp.leaveBalanceAdjustment = 0;
    }

    const absenceDays = Data.attendanceRecords.filter(
      (a) => a.employeeId === emp.id && a.status === "Absent"
    ).length;
    emp.leaveBalance =
      emp.annualVacationDays - absenceDays + emp.leaveBalanceAdjustment;

    if (emp.leaveBalance < 0) {
      emp.leaveBalance = 0;
    }

    emp.status = getLatestStatus(Data.attendanceRecords, emp.id);
  });

  saveDataToStorage();
};

function getLatestStatus(attendanceRecords, employeeId) {
  const employeeRecords = attendanceRecords.filter(
    (a) => a.employeeId === employeeId
  );
  if (employeeRecords.length > 0) {
    const latestRecord = employeeRecords.sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    )[0];
    return latestRecord.status;
  }
  return "Undefined";
}

function renderEmployeeTable() {
  employeeTableBody.innerHTML = "";
  const value = searchInput.value.toLowerCase();
  const filteredData = Data.employees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(value) ||
      emp.department.toLowerCase().includes(value)
  );

  filteredData.forEach((emp) => {
    let statusClass = "";
    switch (emp.status) {
      case "Present":
        statusClass = "status-present";
        break;
      case "Late":
        statusClass = "status-late";
        break;
      case "Absent":
        statusClass = "status-absent";
        break;
      default:
        statusClass = "status-default";
    }

    const row = document.createElement("tr");
    row.innerHTML = `
            <td scope="row">${emp.id}</td>
            <td>${emp.name}</td>
            <td>${emp.department}</td>
            <td><button class="btn ${statusClass}">${emp.status}</button></td>
            <td>${emp.leaveBalance} days</td>
        `;
    employeeTableBody.appendChild(row);
  });
  paginationEnable("pagination-dashboard", "employee-table-body", 5);
}

//**********************  Reports  ****************************** */
const setupReportsSection = () => {
  document.getElementById("totalEmployees").textContent = Data.employees.length;

  const allReports = Data.attendanceRecords.map((rec) => {
    const employee = Data.employees.find((e) => e.id === rec.employeeId);
    return {
      name: employee ? employee.name : "Unknown",
      department: employee ? employee.department : "Unknown",
      date: rec.date,
      status: rec.status,
      notes: rec.notes,
    };
  });

  populateFilters(Data.employees, allReports);
  applyFilters(allReports);
  renderCharts(Data.employees, Data.tasks, Data.attendanceRecords);

  filterDepartment.addEventListener("change", () => applyFilters(allReports));
  filterMonth.addEventListener("change", () => applyFilters(allReports));
  filterStatus.addEventListener("change", () => applyFilters(allReports));
  exportExcelBtn.addEventListener("click", exportToExcel);
  exportPDFBtn.addEventListener("click", exportToPDF);
};

function populateFilters(employees, reports) {
  filterDepartment.innerHTML = '<option value="">All Departments</option>';
  filterMonth.innerHTML = '<option value="">All Months</option>';

  const departments = [...new Set(employees.map((e) => e.department))];
  departments.forEach((dept) => {
    const option = document.createElement("option");
    option.value = dept;
    option.textContent = dept;
    filterDepartment.appendChild(option);
  });

  const months = [...new Set(reports.map((r) => r.date.substring(0, 7)))];
  months.forEach((month) => {
    const option = document.createElement("option");
    option.value = month;
    option.textContent = month;
    filterMonth.appendChild(option);
  });
}

function renderReportTable(dataToRender) {
  reportTableBody.innerHTML = "";
  dataToRender.forEach((row) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
            <td>${row.name}</td>
            <td>${row.department}</td>
            <td>${row.date}</td>
            <td>${row.status}</td>
            <td>${row.notes}</td>
        `;
    reportTableBody.appendChild(tr);
  });
  paginationEnable("pagination-reports-hr", "reportTableBody", 10);
}

function applyFilters(allReports) {
  const selectedDepartment = filterDepartment.value;
  const selectedMonth = filterMonth.value;
  const selectedStatus = filterStatus.value;

  let filteredData = allReports;
  if (selectedDepartment) {
    filteredData = filteredData.filter(
      (r) => r.department === selectedDepartment
    );
  }
  if (selectedMonth) {
    filteredData = filteredData.filter((r) => r.date.startsWith(selectedMonth));
  }
  if (selectedStatus) {
    filteredData = filteredData.filter((r) => r.status === selectedStatus);
  }
  renderReportTable(filteredData);
}

function renderCharts(employees, tasks, attendanceRecords) {
  // Destroy previous chart instances to avoid conflicts
  Chart.getChart("barChart")?.destroy();
  Chart.getChart("pieChart")?.destroy();
  Chart.getChart("lineChart")?.destroy();

  const deptCounts = employees.reduce((acc, emp) => {
    acc[emp.department] = (acc[emp.department] || 0) + 1;
    return acc;
  }, {});

  new Chart(document.getElementById("barChart"), {
    type: "bar",
    data: {
      labels: Object.keys(deptCounts),
      datasets: [
        {
          label: "Number of Employees",
          data: Object.values(deptCounts),
          backgroundColor: "rgba(54, 162, 235, 0.6)",
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 1,
        },
      ],
    },
    options: { responsive: true, maintainAspectRatio: false },
  });

  if (tasks.length > 0) {
    const taskCounts = tasks.reduce((acc, task) => {
      acc[task.status] = (acc[task.status] || 0) + 1;
      return acc;
    }, {});
    new Chart(document.getElementById("pieChart"), {
      type: "pie",
      data: {
        labels: Object.keys(taskCounts),
        datasets: [
          {
            label: "Task Status",
            data: Object.values(taskCounts),
            backgroundColor: ["#4bc0c0", "#ffcd56", "#ff6384"],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true, // Set to true to display the title
            text: "Task Chart", // The text of your chart title
          },
        },
      },
    });
  }

  const monthlyLateMinutes = attendanceRecords.reduce((acc, rec) => {
    if (rec.status === "Late") {
      const month = rec.date.substring(0, 7);
      acc[month] = (acc[month] || 0) + rec.minutesLate;
    }
    return acc;
  }, {});
  new Chart(document.getElementById("lineChart"), {
    type: "line",
    data: {
      labels: Object.keys(monthlyLateMinutes).sort(),
      datasets: [
        {
          label: "Total Late Minutes",
          data: Object.keys(monthlyLateMinutes)
            .sort()
            .map((month) => monthlyLateMinutes[month]),
          borderColor: "rgba(153, 102, 255, 1)",
          tension: 0.1,
        },
      ],
    },
    options: { responsive: true, maintainAspectRatio: false },
  });
}

function exportToExcel() {
  const table = document.getElementById("reportTable");
  if (!table) {
    showMessage(
      'Reports table not found. Make sure the HTML table has id="reportTable".',
      "danger"
    );
    return;
  }
  const csv = [];
  const rows = table.querySelectorAll("tr");

  for (let i = 0; i < rows.length; i++) {
    let row = [],
      cols = rows[i].querySelectorAll("th, td");
    for (let j = 0; j < cols.length; j++) {
      let data = cols[j].innerText.replace(/"/g, '""');
      row.push('"' + data + '"');
    }
    csv.push(row.join(","));
  }

  const csvString = csv.join("\n");
  const a = document.createElement("a");
  a.href = "data:text/csv;charset=utf-8," + encodeURIComponent(csvString);
  a.download = "company_reports.csv";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
function exportToPDF() {
  const table = document.getElementById("reportTable");
  if (!table) {
    showMessage(
      'Reports table not found. Make sure the HTML table has id="reportTable".',
      "danger"
    );
    return;
  }

  // Get jsPDF from the global window object
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // Use autoTable to read HTML table
  doc.autoTable({ html: "#reportTable" });

  // Save the PDF
  doc.save("company_reports.pdf");
  console.log("pdf downloadeded");
}
