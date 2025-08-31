import { getNavbar } from "../components/navbar.js";

const url = "./server/server.json";
const navbar = document.getElementById("navbar-elm");
const Data = {
  employees: [],
  attendanceRecords: [],
  tasks: [],
  requests: [],
  payrolls: [],
};
let loggedEmployee = {};

// automatically load when window is ready
window.addEventListener("load", async () => {
  loadDataFromStorage();
  loggedEmployee = getEmployeeByID(localStorage.getItem("loggedEmployeeID"));
  console.log(loggedEmployee);

  if (loggedEmployee == undefined) {
    window.location.href = "/pages/index.html";
  }
  navbar.innerHTML = getNavbar(
    loggedEmployee.role,
    loggedEmployee.name,
    loggedEmployee.preferences.theme
  );
  Data.attendanceRecords.forEach((emp) => calculateAttendance(emp));

  getAllEmployees();
});

// Function to load data from localStorage
const loadDataFromStorage = () => {
  Data.employees = JSON.parse(localStorage.getItem("employees") || "[]");
  Data.attendanceRecords = JSON.parse(
    localStorage.getItem("attendanceRecords") || "[]"
  );
  Data.tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
  Data.requests = JSON.parse(localStorage.getItem("requests") || "[]");
  Data.payrolls = JSON.parse(localStorage.getItem("payrolls") || "[]");
  console.log("Loaded Data in securityFunctions.js:", Data);
};

const getEmployeeByID = (empID) => {
  return Data.employees.filter((emp) => emp.id == empID)[0];
};

//styling status
function updateSelectColor(select) {
  select.classList.remove("bg-warning", "bg-primary", "bg-danger");
  select.style.color = "white";

  if (select.value === "Late") {
    select.classList.add("bg-warning");
  } else if (select.value === "Present") {
    select.classList.add("bg-success");
  } else if (select.value === "Absent") {
    select.classList.add("bg-danger");
  } else if (select.value === "Leave") {
    select.classList.add("bg-secondary");
  } else if (select.value === "WFH") {
    select.classList.add("bg-primary");
  }
}

//create tr in table
function createNewRow(emp) {
  const allemp = Data.employees.find((e) => e.id == emp.employeeId);
  let NewRow = document.createElement("tr");
  NewRow.style.textAlign = "center";

  //get data
  NewRow.dataset.id = emp.id;
  NewRow.dataset.status = emp.status;
  NewRow.dataset.checkin = emp.checkIn;
  NewRow.dataset.checkout = emp.checkOut;
  NewRow.dataset.notes = emp.notes;

  //create tr
  NewRow.innerHTML = `
     <!-- // checkbox  ----------->
    <th scope="row"><input type="checkbox" class="cursor"></th>

     <!-- // id --------------------->
    <th scope="row">${emp.id}</th>

     <!--//name  ---------------->
    <th scope="row">${allemp.name}</th>

  <!--  //dept  --------- -->
    <th scope="row">${allemp.department}</th>

    <!--   //slect status---------->
    <th scope='row'>
    <select class="cursor  form-select" >
    <option selected>${emp.status}</option>
    <option value="Late">Late</option>
    <option value="Absent">Absent</option>
    <option value="Present">Present</option>
    <option value="Leave">Leave</option>
    <option value="WFH">WFH</option>
    </select>
    </th>

  <!--   //checkin -------- -->
    <th scope='row'><input type="time" name="checkIn" value="${emp.checkIn}" class="rounded-2 "></th>

    <!--   //checkout---------->
    <th scope='row'><input type="time" name="checkOut" value="${emp.checkOut}" class="rounded-2"></th>

   <!--  //mint late  -->
    <th scope='row' id='min'> ${emp.minutesLate} min </th>

    <!--//notes   -->
    <th scope="row" class="text-capitalize">
    <textarea class="form-control" rows="1" placeholder="Enter Your Notes" id="floatingTextarea">${emp.notes}</textarea>
    </th>`;

  let select = NewRow.querySelector("select");

  const alertBox = document.getElementById("myAlert");
  alertBox.textContent = "The Manager Must Be Approved";
  updateSelectColor(select);

  select.addEventListener("change", function (e) {
    let oldStatus = emp.status;
    let newStatus = e.target.value;

    // check wfh
    if (newStatus === "WFH" && emp.isWFH == false) {
      alertBox.textContent = " Manager approval required!";
      alertBox.classList.add("alert-danger");
      e.target.value = oldStatus;

      updateSelectColor(e.target);
      alertBox.classList.remove("d-none");
      setTimeout(() => {
        alertBox.classList.add("d-none");
      }, 2000);
      return;
    }

    // check leave
    if (newStatus === "Leave" && emp.isLeave == false) {
      alertBox.textContent = "Manager approval required!";
      alertBox.classList.add("alert-danger");
      e.target.value = oldStatus;
      updateSelectColor(e.target);
      alertBox.classList.remove("d-none");
      setTimeout(() => {
        alertBox.classList.add("d-none");
      }, 2000);
      return;
    }

    updateSelectColor(e.target);
    emp.status = newStatus;
  });

  // calc minutes to late
  let checkInInput = NewRow.querySelector('input[name="checkIn"]');
  checkInInput.addEventListener("change", function (e) {
    emp.checkIn = e.target.value;
    calculateAttendance(emp);

    NewRow.querySelector("th:nth-child(8)").textContent = `${emp.minutesLate} min`;

    let select = NewRow.querySelector("select");
    select.value = emp.status;
    updateSelectColor(select);

    NewRow.dataset.status = emp.status;
  });

  return NewRow;
}

//select employees
function selectAllEmployee() {
  let headerbox = document.getElementById("checkall");
  headerbox.addEventListener("change", function () {
    let allcheckbox = document.querySelectorAll('tbody input[type="checkbox"]');
    allcheckbox.forEach((cb) => {
      if (headerbox.checked) {
        cb.setAttribute("checked", true);
      } else {
        cb.removeAttribute("checked", true);
      }
    });
  });
}
selectAllEmployee();

function getAllEmployees() {
  let tablebody = document.querySelector("tbody");
  tablebody.innerHTML = "";
  const savedChanges = JSON.parse(
    localStorage.getItem("employeeChanges") || "[]"
  );
//updat change in localstorage
  Data.attendanceRecords.forEach((emp) => {
    const saved = savedChanges.find((e) => e.id == emp.id);
    if (saved) {
      emp.status = saved.status;
      emp.checkIn = saved.checkIn;
      emp.checkOut = saved.checkOut;
      emp.notes = saved.notes;
    }

    let NewRow = createNewRow(emp);
    tablebody.append(NewRow);
  });
}
 
//  search  employee
function searchEmployees() {
  let searchinput = document.querySelector('input[type="search"]');
  let tablebody = document.querySelector("tbody");

  searchinput.addEventListener("input", function () {
    let value = searchinput.value.trim();
    tablebody.innerHTML = "";

    if (value === "") {
      getAllEmployees();
      return;
    }

    let employeeByID = Data.attendanceRecords.find((emp) => emp.id == value);
    //search by id
    if (!isNaN(value)) {
      if (employeeByID) {
        let newrow = createNewRow(employeeByID);
        tablebody.append(newrow);
      } else {
        tablebody.innerHTML = `<tr><td colspan="8" class="text-center text-danger fw-bold fs-5">No employee found</td></tr>`;
      }
    } 
    //search by name
    else {
      let employeeByName = Data.attendanceRecords.filter((emp) => {
        const allemp = Data.employees.find((e) => e.id == emp.employeeId);
        return allemp && allemp.name.toLowerCase().includes(value);
      });
        //get employee
      if (employeeByName.length > 0) {
        employeeByName.forEach((emp) => {
          let newrow = createNewRow(emp);
          tablebody.append(newrow);
        });
      } else {
        tablebody.innerHTML = `<tr><td colspan="8" class="text-center text-danger fw-bold fs-5">No employee found</td></tr>`;
      }
    }
  });
}
searchEmployees();

function updateChanges() {
  const savebtn = document.getElementById("Updata");
  const alertBox = document.getElementById("alertsubmit");

  savebtn.addEventListener("click", function () {
    const tableRows = document.querySelectorAll("tbody tr");

    tableRows.forEach((row) => {
      const oldStatus = row.dataset.status;
      const oldCheckIn = row.dataset.checkin;
      const oldCheckOut = row.dataset.checkout;
      const oldNotes = row.dataset.notes;

      const newStatus = row.querySelector("select").value;
      const newCheckIn = row.querySelector('input[name="checkIn"]').value;
      let newCheckOut = row.querySelector('input[name="checkOut"]').value;
      const newNotes = row.querySelector("textarea").value;

      const emp = Data.attendanceRecords.find((e) => e.id == row.dataset.id);

      if (newCheckIn) {
        if (!newCheckOut) {
          newCheckOut = "17:00";
          if (emp) {
            emp.checkOut = newCheckOut;
            emp.flagged = true;
          }
          row.querySelector('input[name="checkOut"]').value = newCheckOut;
        }
      } else {
        newCheckOut = "";
        if (emp) emp.checkOut = "";
        row.querySelector('input[name="checkOut"]').value = "";
      }

      if (emp) {
        emp.status = newStatus;
        emp.checkIn = newCheckIn;
        emp.checkOut = newCheckOut;
        emp.notes = newNotes;
      }

      row.dataset.status = newStatus;
      row.dataset.checkin = newCheckIn;
      row.dataset.checkout = newCheckOut;
      row.dataset.notes = newNotes;
    });

    localStorage.setItem(
      "employeeChanges",
      JSON.stringify(Data.attendanceRecords)
    );
    alertBox.innerText = "Changes have been saved successfully!";
    alertBox.classList.remove("d-none");
    setTimeout(() => {
      alertBox.classList.add("d-none");
    }, 2000);
  });
}
updateChanges();

function filterByStatus() {
  const filterOptions = document.querySelectorAll(".filter-option");
  const tbody = document.querySelector("tbody");

  filterOptions.forEach((option) => {
    option.addEventListener("click", function (e) {
      e.preventDefault();
      const status = this.dataset.status;

      const tableRows = tbody.querySelectorAll("tr");
      tableRows.forEach((row) => {
        const empStatus = row.dataset.status.trim();
        if (status === "All" || empStatus === status) {
          row.style.display = "";
        } else {
          row.style.display = "none";
        }
      });
    });
  });
}
filterByStatus();

function calculateAttendance(emp) {
  if (!emp.checkIn) {
    emp.status = "Absent";
    emp.minutesLate = 0;
    return emp;
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

  return emp;
}



function initAttendanceByDate() {
  const dateInput = document.querySelector("#attendance-date");
  const tableBody = document.querySelector("tbody");

  const today = new Date().toISOString().slice(0, 10);
  dateInput.value = today;
  dateInput.max = today;

  function renderAttendance(date) {
    tableBody.innerHTML = "";

    const records = Data.attendanceRecords.filter(r => r.date === date);

    if (records.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="9" style="text-align:center;color:red;font-weight:bold;">No employee found</td></tr>`;
      return;
    }

    const isToday = date === today;

    records.forEach(record => {
      const employee = Data.employees.find(e => e.id == record.employeeId);
      if (!employee) return;

      const row = createNewRow(record); 

      if (!isToday) {
        row.querySelectorAll("select, input, textarea, checkbox")
           .forEach(el => el.disabled = true);
      }

      tableBody.appendChild(row);
    });
  }

  renderAttendance(today);

  dateInput.addEventListener("change", () => renderAttendance(dateInput.value));
}

initAttendanceByDate();



