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


window.addEventListener("load", async () => {
    loadDataFromStorage();
    loggedEmployee = getEmployeeByID(localStorage.getItem("loggedEmployeeID"));
    if (loggedEmployee == undefined) {
        window.location.href = "/pages/index.html";
    }
    navbar.innerHTML = getNavbar(loggedEmployee.role, loggedEmployee.name, loggedEmployee.preferences.theme);
});

// Function to get employee by ID
const getEmployeeByID = (empID) => {
    return Data.employees.filter(emp => emp.id == empID)[0];
}

// Function to load all data from localStorage
const loadDataFromStorage = () => {
    Data.employees = JSON.parse(localStorage.getItem("employees") || '[]');
    Data.attendanceRecords = JSON.parse(localStorage.getItem("attendanceRecords") || '[]');
    Data.tasks = JSON.parse(localStorage.getItem("tasks") || '[]');
    Data.requests = JSON.parse(localStorage.getItem("requests") || '[]');
    Data.payrolls = JSON.parse(localStorage.getItem("payrolls") || '[]');
    console.log("Loaded Data in hrFunctions.js:", Data);
}


const showReports = () => {
    document.getElementById('employee-management-section').style.display = 'none';
    document.getElementById('reports-section').style.display = 'block';
    document.getElementById('rewards-penalties-section').style.display = 'none';
};

const showEmployeeManagement = () => {
    document.getElementById('employee-management-section').style.display = 'block';
    document.getElementById('reports-section').style.display = 'none';
    document.getElementById('rewards-penalties-section').style.display = 'block';
};


document.addEventListener("DOMContentLoaded", () => {
    const tableBody = document.getElementById("employee-table-body");
    const searchInput = document.getElementById("searchInput");
    let employeesData = [];
    const stylyeData = 'employeeManagementData';

    
    const showReportsLink = document.getElementById('show-reports-link');
    const showEmployeesLink = document.getElementById('show-employees-link');

    if (showReportsLink) {
        showReportsLink.addEventListener('click', showReports);
    }
    if (showEmployeesLink) {
        showEmployeesLink.addEventListener('click', showEmployeeManagement);
    }

    
    const saveData = (data) => {
        localStorage.setItem(stylyeData, JSON.stringify(data));
    };

    
    const loadData = () => {
        const storedData = localStorage.getItem(stylyeData);
        return storedData ? JSON.parse(storedData) : null;
    };

    
    const initializeData = () => {
        const storedEmployees = loadData();

        if (storedEmployees) {
            employeesData = storedEmployees;
            renderTable(employeesData);
            console.log("Data loaded from localStorage.");
        } else {
            
            fetch("/server/server.json")
                .then(response => response.json())
                .then(data => {
                    const employees = data.employees;
                    const attendance = data.attendanceRecords;
                    employeesData = employees.map(emp => {
                        const absenceDays = attendance.filter(a => a.employeeId === emp.id && a.status === "Absent").length;
                        const leaveBalance = emp.annualVacationDays - absenceDays;
                        return {
                            ...emp,
                            status: getLatestStatus(attendance, emp.id),
                            leaveBalance: leaveBalance >= 0 ? leaveBalance : 0
                        };
                    });
                    renderTable(employeesData);
                    saveData(employeesData); 
                    console.log("Data fetched from server and saved to localStorage.");
                })
                .catch(error => console.error("Error fetching data:", error));
        }
    };

    function getLatestStatus(attendance, employeeId) {
        const employeeRecords = attendance.filter(a => a.employeeId === employeeId);
        if (employeeRecords.length > 0) {
            const latestRecord = employeeRecords.sort((a, b) => new Date(b.date) - new Date(a.date))[0];
            return latestRecord.status;
        }
        return "Undefined";
    }

    function updateLeaveBalance(employeeId, daysToAdd) {
        const employee = employeesData.find(emp => emp.id === employeeId);
        if (employee) {
            employee.leaveBalance += daysToAdd;
            if (employee.leaveBalance < 0) {
                employee.leaveBalance = 0;
            }
            renderTable(employeesData);
            saveData(employeesData);
        }
    }
    //************************************************************************* */

    function renderTable(data) {
        tableBody.innerHTML = "";
        data.forEach(emp => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <th scope="row"><input type="checkbox"></th>
                <td>${emp.id}</td>
                <td>${emp.name}</td>
                <td>${emp.department}</td>
                <td><button class="btn border">${emp.status}</button></td>
                <td>${emp.leaveBalance} days</td>
                <td>
                    <button class="btn btn-sm btn-success bonus-btn" data-employee-id="${emp.id}">+Bonus</button>
                </td>
                <td>
                    <button class="btn btn-sm btn-danger deduction-btn" data-employee-id="${emp.id}">-Deduction</button>
                </td>
               
                
            `;
            tableBody.appendChild(row);
        });
    }
    //************************************************************************* */

    searchInput.addEventListener("keyup", () => {
        const value = searchInput.value.toLowerCase();
        const filtered = employeesData.filter(emp =>
            emp.name.toLowerCase().includes(value) ||
            emp.department.toLowerCase().includes(value)
        );
        renderTable(filtered);
    });
//************************************************************************* */
    tableBody.addEventListener("click", (event) => {
        if (event.target.classList.contains("bonus-btn")) {
            const employeeId = parseInt(event.target.dataset.employeeId);
            updateLeaveBalance(employeeId, 1);
        }
        if (event.target.classList.contains("deduction-btn")) {
            const employeeId = parseInt(event.target.dataset.employeeId);
            updateLeaveBalance(employeeId, -1);
        }
    });
//************************************************************************* */
    document.getElementById("add-bonus-btn").addEventListener("click", () => {
        const selectedEmployees = Array.from(tableBody.querySelectorAll("tr input[type='checkbox']:checked")).map(checkbox => {
            const row = checkbox.closest("tr");
            return parseInt(row.querySelector("td").textContent);
        });

        if (selectedEmployees.length === 0) {
            alert("Please select at least one employee.");
            return;
        }

        selectedEmployees.forEach(employeeId => {
            updateLeaveBalance(employeeId, 1);
        });
    });
//************************************************************************* */
    document.getElementById("deduct-bonus-btn").addEventListener("click", () => {
        const selectedEmployees = Array.from(tableBody.querySelectorAll("tr input[type='checkbox']:checked")).map(checkbox => {
            const row = checkbox.closest("tr");
            return parseInt(row.querySelector("td").textContent);
        });

        if (selectedEmployees.length === 0) {
            alert("Please select at least one employee.");
            return;
        }

        selectedEmployees.forEach(employeeId => {
            updateLeaveBalance(employeeId, -1);
        });
    });

    
    initializeData();

    
    



//************************************************************************* */



    fetch('/server/server.json')
        .then(response => response.json())
        .then(data => {
            const employees = data.employees;
            const totalEmployees = employees.length;
            const attendanceRecords = data.attendanceRecords || [];
            const tasks = data.tasks || [];

            document.getElementById('totalEmployees').textContent = totalEmployees;
            const filterDepartment = document.getElementById('filterDepartment');
            const filterMonth = document.getElementById('filterMonth');
            const filterStatus = document.getElementById('filterStatus');
            const reportTableBody = document.getElementById('reportTableBody');
            const exportExcelBtn = document.getElementById('exportExcel');
            const exportPDFBtn = document.getElementById('exportPDF');

          
            const allReports = attendanceRecords.map(rec => {
                const employee = employees.find(e => e.id === rec.employeeId);
                return {
                    name: employee ? employee.name : 'Unknown',
                    department: employee ? employee.department : 'Unknown',
                    date: rec.date,
                    status: rec.status,
                    notes: rec.notes
                };
            });

            //************************************************************************* */
            function populateFilters() {
                const departments = [...new Set(employees.map(e => e.department))];
                departments.forEach(dept => {
                    const option = document.createElement('option');
                    option.value = dept;
                    option.textContent = dept;
                    filterDepartment.appendChild(option);
                });

                const months = [...new Set(allReports.map(r => r.date.substring(0, 7)))];
                months.forEach(month => {
                    const option = document.createElement('option');
                    option.value = month;
                    option.textContent = month;
                    filterMonth.appendChild(option);
                });
            }

            //************************************************************************* */
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

            //************************************************************************* */
            function applyFilters() {
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

            //************************************************************************* */
            function renderCharts() {
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

            //************************************************************************* */
            function exportToExcel() {
                let table = document.getElementById('reportTableBody');
                let csv = [];
                let rows = table.querySelectorAll('tr');
                
                const headerRow = document.querySelector('.table-dark tr');
                const headers = Array.from(headerRow.querySelectorAll('th')).map(th => `"${th.innerText}"`);
                csv.push(headers.join(','));

                for (let i = 0; i < rows.length; i++) {
                    let row = [], cols = rows[i].querySelectorAll('td');
                    for (let j = 0; j < cols.length; j++) {
                        let data = cols[j].innerText.replace(/"/g, '""');
                        row.push('"' + data + '"');
                    }
                    csv.push(row.join(','));
                }

                let csvString = csv.join('\n');
                let a = document.createElement('a');
                a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvString);
                a.download = 'company_reports.csv';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            }

            //************************************************************************* */
            function exportToPDF() {
                window.jsPDF = window.jspdf.jsPDF;
                const doc = new window.jsPDF('p', 'pt', 'a4');
                const element = document.querySelector('table');
                
                doc.html(element, {
                    callback: function(pdf) {
                        pdf.save('company_reports.pdf');
                    },
                    x: 10,
                    y: 10,
                    html2canvas: { scale: 0.8 }
                });
            }

            //************************************************************************* */
            filterDepartment.addEventListener('change', applyFilters);
            filterMonth.addEventListener('change', applyFilters);
            filterStatus.addEventListener('change', applyFilters);
            exportExcelBtn.addEventListener('click', exportToExcel);
            exportPDFBtn.addEventListener('click', exportToPDF);

            // Initial render
            populateFilters();
            renderCharts();
            applyFilters();
        })
        .catch(err => console.error('Error fetching data:', err));
});