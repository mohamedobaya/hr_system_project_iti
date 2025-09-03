import { paginationEnable } from "../components/pagination.js";
import { loadDataFromStorage, onPageLoad } from "../components/reusableFunctions.js";
import { getEmployeeByID, getRequestByID, updateRequestByStatus, getAttendanceRecordsByID, getTaskByID } from "../components/reusableFunctions.js";

let Data = {
    employees: [],
    attendanceRecords: [],
    tasks: [],
    requests: [],
    payrolls: [],
};

let loggedEmployee = {};

// Load data and initialize
window.addEventListener("load", async () => {
    Data = await loadDataFromStorage();
    loggedEmployee = getEmployeeByID(localStorage.getItem("loggedEmployeeID"));

    onPageLoad(loggedEmployee);
    showAttendanceByDate();

    Data.attendanceRecords.forEach((emp) => calculateAttendance(emp));
});

//sava to localstorage
function saveAttendanceToStorage() {
    localStorage.setItem("attendanceRecords", JSON.stringify(Data.attendanceRecords));
}


// Styling status select
function updateSelectColor(select) {
    select.classList.remove("bg-warning", "bg-success", "bg-danger", "bg-secondary", "bg-primary");
    select.style.color = "white";

    const statusClasses = {
        "Late": "bg-warning",
        "Present": "bg-success",
        "Absent": "bg-danger",
        "Leave": "bg-secondary",
        "WFH": "bg-primary"
    };

    if (statusClasses[select.value]) {
        select.classList.add(statusClasses[select.value]);
    }
}

// Create table row
function createNewRow(emp) {
    const allemp = Data.employees.find((e) => e.id == emp.employeeId);
    let NewRow = document.createElement("tr");
    NewRow.style.textAlign = "center";

    NewRow.dataset.id = emp.id;
    NewRow.dataset.status = emp.status;
    NewRow.dataset.checkin = emp.checkIn;
    NewRow.dataset.checkout = emp.checkOut;
    NewRow.dataset.notes = emp.notes;


    NewRow.innerHTML = `
        <td scope="row"><input type="checkbox" class="cursor"></td>
        <td scope="row">${allemp.id}</td>
        <td scope="row">${allemp.name}</td>
        <td scope="row">${allemp.department}</td>
        <td scope="row">
        <select class="cursor form-select" name="status">
        <option value="Present" ${emp.status === "Present" ? "selected" : ""}>Present</option>
        <option value="Late" ${emp.status === "Late" ? "selected" : ""}>Late</option>
        <option value="Absent" ${emp.status === "Absent" ? "selected" : ""}>Absent</option>
        <option value="Leave" ${emp.status === "Leave" ? "selected" : ""}>Leave</option>
        <option value="WFH" ${emp.status === "WFH" ? "selected" : ""}>WFH</option>
        </select>
        </td>
        <td scope="row"><input type="time" name="checkIn" value="${emp.checkIn}" class="rounded-2"></td>
        <td scope="row"><input type="time" name="checkOut" value="${emp.checkOut}" class="rounded-2"></td>
        <td scope="row" id='min'>${emp.minutesLate} min</td>
        <td scope="row" class="text-capitalize">
        <textarea name="notes" class="form-control" rows="1" placeholder="Enter Your Notes">${emp.notes}</textarea>
        </td>
    `;


    const approvedRequest = Data.requests.find(r =>
        r.employeeId == emp.employeeId &&
        r.date === emp.date &&
        (r.type === "WFH" || r.type === "Leave") &&
        r.status === "Approved"
    );

    if (approvedRequest) {
        emp.status = approvedRequest.type;
        const select = NewRow.querySelector("select");
        select.value = approvedRequest.type;
        updateSelectColor(select);
    }

    const select = NewRow.querySelector("select");
    const alertBox = document.getElementById("myAlert");
    alertBox.textContent = "The Manager Must Be Approved";

    updateSelectColor(select);

    select.addEventListener("change", function (e) {
        const oldStatus = emp.status;
        const newStatus = e.target.value;
        if (newStatus === "WFH" || newStatus === "Leave") {
            const approvedRequest = Data.requests.find(r =>
                r.employeeId == emp.employeeId &&
                r.date === emp.date &&
                r.type === newStatus &&
                r.status === "Approved"
            );

            if (!approvedRequest) {
                alertBox.textContent = "Manager approval required!";
                alertBox.classList.add("alert-danger");
                e.target.value = oldStatus;
                updateSelectColor(e.target);
                alertBox.classList.remove("d-none");
                setTimeout(() => alertBox.classList.add("d-none"), 2000);
                return;
            }

        }




        emp.status = newStatus;
        updateSelectColor(e.target);
        saveAttendanceToStorage();
    });

    const checkInInput = NewRow.querySelector('input[name="checkIn"]');
    checkInInput.addEventListener("change", function (e) {
        emp.checkIn = e.target.value;

        calculateAttendance(emp);

        const statusSelect = NewRow.querySelector("select");
        statusSelect.value = emp.status;
        updateSelectColor(statusSelect);

        NewRow.querySelector("#min").innerText = emp.minutesLate + " min";
        NewRow.querySelector('textarea[name="notes"]').value = emp.notes;


        saveAttendanceToStorage();
    });

    const checkOutInput = NewRow.querySelector('input[name="checkOut"]');
    checkOutInput.addEventListener("change", function (e) {
        emp.checkOut = e.target.value;

        calculateAttendance(emp);

        const statusSelect = NewRow.querySelector("select");
        statusSelect.value = emp.status;
        updateSelectColor(statusSelect);

        NewRow.querySelector("#min").innerText = emp.minutesLate + " min";
        NewRow.querySelector('textarea[name="notes"]').value = emp.notes;


        saveAttendanceToStorage();
    });

    const notesInput = NewRow.querySelector('textarea[name="notes"]');
    notesInput.addEventListener("input", function (e) {
        emp.notes = e.target.value;
        saveAttendanceToStorage();
    });

    return NewRow;
}

// Select all employees
function selectAllEmployee() {
    const headerbox = document.getElementById("checkall");
    headerbox.addEventListener("change", function () {
        const allcheckbox = document.querySelectorAll('tbody input[type="checkbox"]');
        allcheckbox.forEach((cb) => cb.checked = headerbox.checked);
    });
}
selectAllEmployee();

// Bulk action
let isBulkUpdating = false;
function enableBulkAction() {
    const tableBody = document.querySelector("tbody");

    tableBody.addEventListener("change", function (e) {
        if (isBulkUpdating) return;
        const target = e.target;
        if (target.type === "checkbox") return;

        const row = target.closest("tr");
        if (!row || !row.querySelector('input[type="checkbox"]').checked) return;

        const selectedRows = tableBody.querySelectorAll('tr input[type="checkbox"]:checked');
        isBulkUpdating = true;

        selectedRows.forEach(cb => {
            const r = cb.closest("tr");
            if (r === row) return;

            const el = r.querySelector([name="${target.name}"]);
            if (!el) return;

            if (el.type === "checkbox") el.checked = target.checked;
            else el.value = target.value;

            el.dispatchEvent(new Event("change", { bubbles: true }));
        });

        isBulkUpdating = false;
        saveAttendanceToStorage();
    });
}
enableBulkAction();

// Search Employees
function searchEmployees() {
    const searchinput = document.querySelector('input[type="search"]');
    const tablebody = document.querySelector("tbody");
    const dateInput = document.querySelector("#attendance-date");
    const today = new Date().toISOString().split('T')[0];

    function getRecordsForDate(date) {
        return Data.attendanceRecords.filter(row => row.date === date);
    }

    function renderRecords(records) {
        tablebody.innerHTML = "";
        if (records.length === 0) {
            tablebody.innerHTML = <tr><td colspan="9" style="text-align:center;color:red;font-weight:bold;">No employee found</td></tr>;
            return;
        }

        const isToday = (dateInput.value || today) === today;
        records.forEach(record => {
            const employee = Data.employees.find(e => e.id == record.employeeId);
            if (!employee) return;

            const row = createNewRow(record);
            row.querySelectorAll("select, input, textarea, input[type='checkbox']").forEach(el => el.disabled = !isToday);
            tablebody.appendChild(row);
        });
    }

    searchinput.addEventListener("input", function () {
        const value = searchinput.value.trim();
        const date = dateInput.value || today;

        if (!value) {
            renderRecords(getRecordsForDate(date));
            return;
        }

        const records = getRecordsForDate(date);
        let filtered = [];

        if (!isNaN(Number(value))) {
            filtered = records.filter(row => row.employeeId == value);
        } else {
            const low = value.toLowerCase();
            const matchingIds = Data.employees
                .filter(emp => (emp.name || "").toLowerCase().includes(low))
                .map(emp => emp.id);
            filtered = records.filter(r => matchingIds.includes(r.employeeId));
        }

        renderRecords(filtered);
    });
}
searchEmployees();

// Update Changes
function updateChanges() {
    const savebtn = document.getElementById("Updata");
    const alertBox = document.getElementById("alertsubmit");

    savebtn.addEventListener("click", function () {
        const tableRows = document.querySelectorAll("tbody tr");
        let anyChange = false;
        let hasError = false;

        for (let row of tableRows) {
            const newStatus = row.querySelector("select").value;
            const newCheckIn = row.querySelector('input[name="checkIn"]').value;
            let newCheckOut = row.querySelector('input[name="checkOut"]').value;
            const newNotes = row.querySelector("textarea").value;
            const emp = Data.attendanceRecords.find((e) => e.id == row.dataset.id);

            if (!emp) continue;

            const changed = (
                emp.status !== newStatus ||
                emp.checkIn !== newCheckIn ||
                emp.checkOut !== newCheckOut ||
                emp.notes !== newNotes
            );

            if (!newCheckIn && newCheckOut) {
                alertBox.innerText = "Check-Out cannot be set without Check-In!";
                alertBox.classList.remove("d-none");
                alertBox.classList.add("alert-danger");
                row.querySelector('input[name="checkOut"]').value = "";
                setTimeout(() => alertBox.classList.add("d-none"), 2000);
                hasError = true;
                continue;
            }

            if (newCheckIn && (newCheckOut === "" || !newCheckOut)) {
                newCheckOut = "17:00";
                row.querySelector('input[name="checkOut"]').value = newCheckOut;
            }

            emp.status = newStatus;
            emp.checkIn = newCheckIn;
            emp.checkOut = newCheckOut;
            emp.notes = newNotes;

            calculateAttendance(emp);

            row.querySelector('input[name="checkOut"]').value = emp.checkOut;
            row.querySelector("select").value = emp.status;
            updateSelectColor(row.querySelector("select"));
            row.querySelector("#min").innerText = emp.minutesLate + " min";

            if (changed) anyChange = true;
        }

        if (hasError) return;

        saveAttendanceToStorage();

        if (anyChange) {
            alertBox.innerText = " Changes have been saved successfully";
            alertBox.classList.remove("alert-danger");
            alertBox.classList.add("alert-success");
        } else {
            alertBox.innerText = " No changes detected!";
            alertBox.classList.remove("alert-success");
            alertBox.classList.add("alert-danger");
        }

        alertBox.classList.remove("d-none");
        setTimeout(() => alertBox.classList.add("d-none"), 2000);
    });
}
updateChanges()

// Filter by Status
function filterByStatus() {
    const filterOptions = document.querySelectorAll(".filter-option");
    const tbody = document.querySelector("tbody");

    filterOptions.forEach((option) => {
        option.addEventListener("click", function (e) {
            e.preventDefault();
            const status = this.dataset.status.trim();
            tbody.querySelectorAll("tr").forEach((row) => {
                const empStatus = row.dataset.status.trim();
                row.style.display = (status === "All" || empStatus.toLowerCase() === status.toLowerCase()) ? "" : "none";
            });
        });
    });
}
filterByStatus();

// Calculate Attendance
function calculateAttendance(emp) {
    if (!emp.checkIn) {
        emp.status = "Absent";
        emp.minutesLate = 0;
    } else {
        if (!emp.checkOut || emp.checkOut === "") {
            emp.checkOut = "17:00";
        }

        const [hours, minutes] = emp.checkIn.split(":").map(Number);
        const totalMinutes = hours * 60 + minutes;
        const officialStart = 9 * 60;
        const lateThreshold = 11 * 60;

        if (totalMinutes <= officialStart) {
            emp.status = "Present";
            emp.minutesLate = 0;
        } else if (totalMinutes < lateThreshold) {
            emp.status = "Late";
            emp.minutesLate = totalMinutes - officialStart;
            emp.notes = "Arrived late";
        } else {
            emp.status = "Absent";
            emp.minutesLate = 0;
        }
    }

    saveAttendanceToStorage();
    return emp;
}


// Attendance by Date
function showAttendanceByDate() {
    const dateInput = document.querySelector("#attendance-date");
    const today = new Date().toISOString().split('T')[0];

    dateInput.value = today;
    dateInput.max = today;

    showAttendanceForDate(today);
    renderAttendance(today);

    dateInput.addEventListener("change", () => {
        const selectedDate = dateInput.value;
        showAttendanceForDate(selectedDate);
        renderAttendance(selectedDate);
    });
}

function renderAttendance(date) {
    const tableBody = document.querySelector("tbody");
    tableBody.innerHTML = "";

    const records = Data.attendanceRecords.filter(r => r.date === date);
    if (records.length === 0) {
        tableBody.innerHTML = <tr><td colspan="9" style="text-align:center;color:red;font-weight:bold;">No employee found</td></tr>;
        return;
    }

    const today = new Date().toISOString().split('T')[0];
    const isToday = date === today;

    records.forEach(record => {
        const employee = Data.employees.find(e => e.id == record.employeeId);
        if (!employee) return;

        const row = createNewRow(record);
        row.querySelectorAll("select, input, textarea, input[type='checkbox']").forEach(el => el.disabled = !isToday);
        tableBody.appendChild(row);
    });
        paginationEnable("pagination-security", "table-security", 8);

}

function showAttendanceForDate(date) {
    const today = new Date().toISOString().split('T')[0];

    Data.employees.forEach(emp => {
        const exists = Data.attendanceRecords.find(row => row.employeeId == emp.id && row.date === date);
        if (!exists) {
            Data.attendanceRecords.push({
                id: date + "-" + emp.id,
                employeeId: emp.id,
                date: date,
                checkIn: "",
                checkOut: "",
                status: "Absent",
                minutesLate: 0,
                isWFH: false,
                isLeave: false,
                notes: ""
            });
        }
    });

    saveAttendanceToStorage();
    

}