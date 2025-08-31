import { getNavbar } from "../components/navbar.js";

const url = "./server/server.json";
const navbar = document.getElementById("navbar-elm");
const Data = {
    employees: [],
    attendanceRecords: [],
    tasks: [],
    requests: [],
    payrolls: []
};
let loggedEmployee = {};


const employeeTableBody = document.getElementById("employee-table-body");
const searchInput = document.getElementById("searchInput");

const reportTableBody = document.getElementById('reportTableBody');
const filterDepartment = document.getElementById('filterDepartment');
const filterMonth = document.getElementById('filterMonth');
const filterStatus = document.getElementById('filterStatus');
const exportExcelBtn = document.getElementById('exportExcel');
const exportPDFBtn = document.getElementById('exportPDF');
const messageBox = document.getElementById('message-box');


const showMessage = (message, type = 'info') => {
    messageBox.textContent = message;
    messageBox.className = `alert alert-${type}`;
    messageBox.style.display = 'block';
    setTimeout(() => {
        messageBox.style.display = 'none';
    }, 3000);
};

window.addEventListener("load", async () => {
    await initializeData();
    loggedEmployee = getEmployeeByID(localStorage.getItem("loggedEmployeeID"));
    if (loggedEmployee == undefined) {
        window.location.href = "/pages/index.html";
        return;
    }
    navbar.innerHTML = getNavbar(loggedEmployee.role, loggedEmployee.name, loggedEmployee.preferences.theme);
    
   
    updateEmployeeStatusAndLeaveBalance();
    renderEmployeeTable();
    setupReportsSection();

    
    searchInput.addEventListener("keyup", renderEmployeeTable);
    employeeTableBody.addEventListener("click", handleTableButtonClick);
});


const initializeData = async () => {
    const storedEmployees = JSON.parse(localStorage.getItem("employees"));
    
    if (storedEmployees && storedEmployees.length > 0) {
        
        loadDataFromStorage();
        console.log("Data loaded from localStorage.");
    } else {
        
        try {
            const response = await fetch(url);
            const data = await response.json();
            Data.employees = data.employees;
            Data.attendanceRecords = data.attendanceRecords;
            Data.tasks = data.tasks;
            Data.requests = data.requests;
            Data.payrolls = data.payrolls;
            saveDataToStorage();
            console.log("Data fetched from server and saved to localStorage.");
        } catch (error) {
            console.error("Error fetching data:", error);
            showMessage('Error fetching data from server.', 'danger');
        }
    }
};


const loadDataFromStorage = () => {
    Data.employees = JSON.parse(localStorage.getItem("employees") || '[]');
    Data.attendanceRecords = JSON.parse(localStorage.getItem("attendanceRecords") || '[]');
    Data.tasks = JSON.parse(localStorage.getItem("tasks") || '[]');
    Data.requests = JSON.parse(localStorage.getItem("requests") || '[]');
    Data.payrolls = JSON.parse(localStorage.getItem("payrolls") || '[]');
};

const saveDataToStorage = () => {
    localStorage.setItem("employees", JSON.stringify(Data.employees));
    localStorage.setItem("attendanceRecords", JSON.stringify(Data.attendanceRecords));
    localStorage.setItem("tasks", JSON.stringify(Data.tasks));
    localStorage.setItem("requests", JSON.stringify(Data.requests));
    localStorage.setItem("payrolls", JSON.stringify(Data.payrolls));
};

const getEmployeeByID = (empID) => {
    
    return Data.employees.find(emp => emp.id === Number(empID));
};

const updateEmployeeStatusAndLeaveBalance = () => {
    Data.employees.forEach(emp => {
        const absenceDays = Data.attendanceRecords.filter(a => a.employeeId === emp.id && a.status === "Absent").length;
        emp.leaveBalance = emp.annualVacationDays - absenceDays;
        if (emp.leaveBalance < 0) {
            emp.leaveBalance = 0;
        }
        emp.status = getLatestStatus(Data.attendanceRecords, emp.id);
    });
};

function getLatestStatus(attendanceRecords, employeeId) {
    const employeeRecords = attendanceRecords.filter(a => a.employeeId === employeeId);
    if (employeeRecords.length > 0) {
        const latestRecord = employeeRecords.sort((a, b) => new Date(b.date) - new Date(a.date))[0];
        return latestRecord.status;
    }
    return "Undefined";
}

function updateLeaveBalance(employeeId, daysToAdd) {
    
    const employee = Data.employees.find(emp => emp.id === Number(employeeId));
    if (employee) {
        employee.leaveBalance += daysToAdd;
        if (employee.leaveBalance < 0) {
            employee.leaveBalance = 0;
        }
        
        saveDataToStorage();
        renderEmployeeTable();
        showMessage(`Updated leave balance for employee ${employee.name}.`, 'success');
    }
}

function renderEmployeeTable() {
    employeeTableBody.innerHTML = "";
    const value = searchInput.value.toLowerCase();
    const filteredData = Data.employees.filter(emp =>
        emp.name.toLowerCase().includes(value) ||
        emp.department.toLowerCase().includes(value)
    );

    filteredData.forEach(emp => {
        const row = document.createElement("tr");
        row.innerHTML = `

            <td>${emp.id}</td>
            <td>${emp.name}</td>
            <td>${emp.department}</td>
            <td><button class="btn border">${emp.status}</button></td>
            <td>${emp.leaveBalance} days</td>
            <td>
                <button class="btn btn-sm btn-success bonus-btn" id="bonus-btn-${emp.id}" data-employee-id="${emp.id}">+Bouns</button>
            </td>
            <td>
                <button class="btn btn-sm btn-danger deduction-btn" id="deduction-btn-${emp.id}" data-employee-id="${emp.id}">-Deduction</button>
            </td>
            <td>
                <button class="btn btn-sm btn-info text-white" data-employee-id="${emp.id}">Get Awards</button>
            </td>
        `;
        employeeTableBody.appendChild(row);
    });
}

const handleTableButtonClick = (event) => {
    const targetId = event.target.id;
    if (targetId.startsWith("bonus-btn-") || targetId.startsWith("deduction-btn-")) {
        const employeeId = event.target.dataset.employeeId;
        const daysToAdd = targetId.startsWith("bonus-btn-") ? 1 : -1;
        updateLeaveBalance(employeeId, daysToAdd);
    }
};

const handleBulkAction = (daysToAdd) => {
    const selectedEmployees = Array.from(employeeTableBody.querySelectorAll("tr input[type='checkbox']:checked")).map(checkbox => {
        return checkbox.dataset.employeeId;
    });

    if (selectedEmployees.length === 0) {
        showMessage("Please select at least one employee.", 'warning');
        return;
    }

    selectedEmployees.forEach(employeeId => {
        updateLeaveBalance(employeeId, daysToAdd);
    });
};

//**********************  Reports  ****************************** */
const setupReportsSection = () => {
    document.getElementById('totalEmployees').textContent = Data.employees.length;
    
    const allReports = Data.attendanceRecords.map(rec => {
        const employee = Data.employees.find(e => e.id === rec.employeeId);
        return {
            name: employee ? employee.name : 'Unknown',
            department: employee ? employee.department : 'Unknown',
            date: rec.date,
            status: rec.status,
            notes: rec.notes
        };
    });

    populateFilters(Data.employees, allReports);
    applyFilters(allReports);
    renderCharts(Data.employees, Data.tasks, Data.attendanceRecords);
    
    filterDepartment.addEventListener('change', () => applyFilters(allReports));
    filterMonth.addEventListener('change', () => applyFilters(allReports));
    filterStatus.addEventListener('change', () => applyFilters(allReports));
    exportExcelBtn.addEventListener('click', exportToExcel);
    exportPDFBtn.addEventListener('click', exportToPDF);
};

function populateFilters(employees, reports) {
    
    filterDepartment.innerHTML = '<option value="">All Departments</option>';
    filterMonth.innerHTML = '<option value="">All Months</option>';

    const departments = [...new Set(employees.map(e => e.department))];
    departments.forEach(dept => {
        const option = document.createElement('option');
        option.value = dept;
        option.textContent = dept;
        filterDepartment.appendChild(option);
    });

    const months = [...new Set(reports.map(r => r.date.substring(0, 7)))];
    months.forEach(month => {
        const option = document.createElement('option');
        option.value = month;
        option.textContent = month;
        filterMonth.appendChild(option);
    });
}

function renderReportTable(dataToRender) {
    reportTableBody.innerHTML = '';
    dataToRender.forEach(row => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${row.name}</td>
            <td>${row.department}</td>
            <td>${row.date}</td>
            <td>${row.status}</td>
            <td>${row.notes}</td>
        `;
        reportTableBody.appendChild(tr);
    });
}

function applyFilters(allReports) {
    const selectedDepartment = filterDepartment.value;
    const selectedMonth = filterMonth.value;
    const selectedStatus = filterStatus.value;

    let filteredData = allReports;
    if (selectedDepartment) {
        filteredData = filteredData.filter(r => r.department === selectedDepartment);
    }
    if (selectedMonth) {
        filteredData = filteredData.filter(r => r.date.startsWith(selectedMonth));
    }
    if (selectedStatus) {
        filteredData = filteredData.filter(r => r.status === selectedStatus);
    }
    renderReportTable(filteredData);
}

function renderCharts(employees, tasks, attendanceRecords) {
    // Destroy previous chart instances to avoid conflicts
    Chart.getChart('barChart')?.destroy();
    Chart.getChart('pieChart')?.destroy();
    Chart.getChart('lineChart')?.destroy();

    const deptCounts = employees.reduce((acc, emp) => {
        acc[emp.department] = (acc[emp.department] || 0) + 1;
        return acc;
    }, {});
    
    new Chart(document.getElementById('barChart'), {
        type: 'bar',
        data: {
            labels: Object.keys(deptCounts),
            datasets: [{
                label: 'Number of Employees',
                data: Object.values(deptCounts),
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });

    if (tasks.length > 0) {
        const taskCounts = tasks.reduce((acc, task) => {
            acc[task.status] = (acc[task.status] || 0) + 1;
            return acc;
        }, {});
        new Chart(document.getElementById('pieChart'), {
            type: 'pie',
            data: {
                labels: Object.keys(taskCounts),
                datasets: [{
                    label: 'Task Status',
                    data: Object.values(taskCounts),
                    backgroundColor: ['#4bc0c0', '#ffcd56', '#ff6384']
                }]
            },
            options: { responsive: true, maintainAspectRatio: false }
        });
    }

    const monthlyLateMinutes = attendanceRecords.reduce((acc, rec) => {
        if (rec.status === 'Late') {
            const month = rec.date.substring(0, 7);
            acc[month] = (acc[month] || 0) + rec.minutesLate;
        }
        return acc;
    }, {});
    new Chart(document.getElementById('lineChart'), {
        type: 'line',
        data: {
            labels: Object.keys(monthlyLateMinutes).sort(),
            datasets: [{
                label: 'Total Late Minutes',
                data: Object.keys(monthlyLateMinutes).sort().map(month => monthlyLateMinutes[month]),
                borderColor: 'rgba(153, 102, 255, 1)',
                tension: 0.1
            }]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });
}

function exportToExcel() {
   
    const table = document.getElementById('reportTable'); 
    if (!table) {
        showMessage('Reports table not found. Make sure the HTML table has id="reportTable".', 'danger');
        return;
    }
    const csv = [];
    const rows = table.querySelectorAll('tr');

    for (let i = 0; i < rows.length; i++) {
        let row = [], cols = rows[i].querySelectorAll('th, td');
        for (let j = 0; j < cols.length; j++) {
            let data = cols[j].innerText.replace(/"/g, '""');
            row.push('"' + data + '"');
        }
        csv.push(row.join(','));
    }

    const csvString = csv.join('\n');
    const a = document.createElement('a');
    a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvString);
    a.download = 'company_reports.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

function exportToPDF() {
    window.jsPDF = window.jspdf.jsPDF;
    
    const doc = new window.jsPDF('p', 'pt', 'a4');
    const element = document.querySelector('#reportTable');
    
    if (!element) {
        showMessage('Reports table not found. Make sure the HTML table has id="reportTable".', 'danger');
        return;
    }

    doc.html(element, {
        callback: function(pdf) {
            pdf.save('company_reports.pdf');
        },
        x: 10,
        y: 10,
        html2canvas: { scale: 0.8 }
    });
}