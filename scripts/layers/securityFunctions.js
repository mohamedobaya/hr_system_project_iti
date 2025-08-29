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
let loggedEmployee = {}

// automatically load when window is ready
window.addEventListener("load", async () => {
    loadDataFromStorage();
    loggedEmployee = getEmployeeByID(localStorage.getItem("loggedEmployeeID"));
    console.log(loggedEmployee);

    if (loggedEmployee == undefined) {
        window.location.href = "/pages/index.html";
    }
    navbar.innerHTML = getNavbar(loggedEmployee.role, loggedEmployee.name, loggedEmployee.preferences.theme);
    getAllEmployees();
    //    setColor();
});


// Function to load data from localStorage
const loadDataFromStorage = () => {
    Data.employees = JSON.parse(localStorage.getItem("employees") || '[]');
    Data.attendanceRecords = JSON.parse(localStorage.getItem("attendanceRecords") || '[]');
    Data.tasks = JSON.parse(localStorage.getItem("tasks") || '[]');
    Data.requests = JSON.parse(localStorage.getItem("requests") || '[]');
    Data.payrolls = JSON.parse(localStorage.getItem("payrolls") || '[]');
    console.log("Loaded Data in securityFunctions.js:", Data);
}

const getEmployeeByID = (empID) => {
    return Data.employees.filter(emp => emp.id == empID)[0];
}

function statusEmployeeOption(statusOption) {

    const statuses = ["Present", "Late", "Absent"];

    return statuses.map(status => {
        let style = "";
        if (status === "Late") style = "background-color:#ffc107; color:#000;";
        else if (status === "Present") style = "background-color:#0d6efd; color:#fff;";
        else if (status === "Absent") style = "background-color:#dc3545; color:#fff;";

        return `<option style="${style}" ${status === statusOption ? "selected" : ""}>${status}</option>`;
    });
}

function setColor(color) {

    color.classList.remove('bg-warning', 'bg-primary', 'bg-danger', 'text-white');

    if (color.value === 'Late') {
        color.classList.add('bg-warning');
    } else if (color.value === 'Present') {
        color.classList.add('bg-primary');
    } else if (color.value === 'Absent') {
        color.classList.add('bg-danger');
    }
}

function createNewRow(emp) {
    const allemp = Data.employees.find(e => e.id == emp.employeeId);
    let optionsHTML = statusEmployeeOption(emp.status);

    let NewRow = document.createElement('tr');
    NewRow.style.textAlign = 'center';
    NewRow.innerHTML = `
    <th scope="row"><input type="checkbox" class="cursor"></th>
    <th scope="row">${emp.id}</th>
    <th scope="row">${allemp.name}</th>
    <th scope="row">${allemp.department}</th>
    <th scope="row"><select class="form-select cursor">${optionsHTML}</select></th>
    <th scope="row"><input type="time" value="${emp.checkIn}" class="rounded-2 py-0 px-2"></th>
    <th scope="row"><input type="time" value="${emp.checkOut}" class="rounded-2 py-0 px-2"></th>
    <th scope="row" class="text-capitalize">${emp.notes}</th>
  `;

    let selector = NewRow.querySelector('select');
    setColor(selector);
    selector.addEventListener('change', (e) => setColor(e.target));

    return NewRow;
}

function getAllEmployees() {

    let tablebody = document.querySelector('tbody');

    Data.attendanceRecords.forEach(emp => {
        let NewRow = createNewRow(emp);
        tablebody.append(NewRow);
    });
}


function searchEmployees() {
    let searchinput = document.querySelector('input[type="search"]');
    let tablebody = document.querySelector('tbody');

    searchinput.addEventListener('input', function () {
        let value = searchinput.value.trim();
        tablebody.innerHTML = "";

        if (value === '') {
            getAllEmployees();
            return;
        }

        let employeeByID = Data.attendanceRecords.find(emp => emp.id == value);
        if (!isNaN(value)) {

            if (employeeByID) {
                let newrow = createNewRow(employeeByID);
                tablebody.append(newrow)
            } else {
                tablebody.innerHTML = `<tr><td colspan="8" class="text-center text-danger fw-bold fs-5">No employee found</td></tr>`;
            }

        } else {
            let employeeByName = Data.attendanceRecords.filter(emp => {
                const allemp = Data.employees.find(e => e.id == emp.employeeId);
                return allemp && allemp.name.toLowerCase().includes(value);
            })

            if (employeeByName.length > 0) {
                employeeByName.forEach(
                    emp => {
                        let newrow = createNewRow(emp);
                        tablebody.append(newrow)
                    }
                )
            } else {
                tablebody.innerHTML = `<tr><td colspan="8" class="text-center text-danger fw-bold fs-5">No employee found</td></tr>`;
            }
        }
    })

}

searchEmployees();




function updateChanges() {
    let savebtn = document.getElementById("Updata");
    savebtn.addEventListener('click', function () {

    })
}


updateChanges()