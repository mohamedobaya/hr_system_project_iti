import { getNavbar } from "../components/navbar.js";

const Data = {
  employees: [],
  attendanceRecords: [],
  tasks: [],
  requests: [],
  payrolls: [],
  employees: [],
  attendanceRecords: [],
  tasks: [],
  requests: [],
  payrolls: [],
};
let loggedEmployee = {};
let loggedEmployee = {};

// automatically load when window is ready
window.addEventListener("load", async () => {
  loadDataFromStorage();
  loggedEmployee = getEmployeeByID(localStorage.getItem("loggedEmployeeID"));
  if (loggedEmployee == undefined) {
    window.location.href = "/pages/index.html";
  }
  document.getElementById("navbar-elm").innerHTML = getNavbar(
    loggedEmployee.role,
    loggedEmployee.name,
    loggedEmployee.preferences?.theme || "light"
  );

  renderTasks();
  renderAttendance();
  renderRequests();
  renderQuota();
  loadDataFromStorage();
  loggedEmployee = getEmployeeByID(localStorage.getItem("loggedEmployeeID"));
  if (loggedEmployee == undefined) {
    window.location.href = "/pages/index.html";
  }
  document.getElementById("navbar-elm").innerHTML = getNavbar(
    loggedEmployee.role,
    loggedEmployee.name,
    loggedEmployee.preferences?.theme || "light"
  );

  renderTasks();
  renderAttendance();
  renderRequests();
  renderQuota();
});

// ---------------- Load & Get Data ----------------
// ---------------- Load & Get Data ----------------
const loadDataFromStorage = () => {
  Data.employees = JSON.parse(localStorage.getItem("employees") || "[]");
  Data.attendanceRecords = JSON.parse(localStorage.getItem("attendanceRecords") || "[]");
  Data.tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
  Data.requests = JSON.parse(localStorage.getItem("requests") || "[]");
  Data.payrolls = JSON.parse(localStorage.getItem("payrolls") || "[]");
};

const saveDataToStorage = () => {
  localStorage.setItem("requests", JSON.stringify(Data.requests));
};
  Data.employees = JSON.parse(localStorage.getItem("employees") || "[]");
  Data.attendanceRecords = JSON.parse(localStorage.getItem("attendanceRecords") || "[]");
  Data.tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
  Data.requests = JSON.parse(localStorage.getItem("requests") || "[]");
  Data.payrolls = JSON.parse(localStorage.getItem("payrolls") || "[]");
};

const saveDataToStorage = () => {
  localStorage.setItem("requests", JSON.stringify(Data.requests));
};

const getEmployeeByID = (empID) => {
  return Data.employees.filter((emp) => emp.id == empID)[0];
};

// Drag and Drop for Tasks (Waled)
let dragged = null;
function makeDraggable(li) {
  li.setAttribute("draggable", "true");

  li.addEventListener("dragstart", (e) => {
    dragged = li;
    li.classList.add("dragging");
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", "");
  });

  li.addEventListener("dragend", () => {
    li.classList.remove("dragging");
    dragged = null;
  });
}

// get tasks condition and render them (waled)
function renderTasks() {
  const loggedEmployeeID = parseInt(localStorage.getItem("loggedEmployeeID"));
  const myTasks = Data.tasks.filter((t) => t.employeeId === loggedEmployeeID);

  document.getElementById("todo").innerHTML = "";
  document.getElementById("doing").innerHTML = "";
  document.getElementById("done").innerHTML = "";

  myTasks.forEach((task) => {
    let li = document.createElement("li");
    li.className = "bg-primary-subtle rounded p-2 my-2";
    li.textContent = task.description;

    li.setAttribute("data-id", task.id);

    makeDraggable(li);

    if (task.status === "Pending") {
      document.getElementById("todo").appendChild(li);
    } else if (task.status === "In Progress") {
      document.getElementById("doing").appendChild(li);
    } else {
      document.getElementById("done").appendChild(li);
    }
  });

  document.querySelectorAll("ul.list-unstyled").forEach((ul) => {
    ul.addEventListener("dragover", (e) => {
      e.preventDefault();
      ul.style.backgroundColor = "#e0f7fa";
    });

    ul.addEventListener("dragleave", () => {
      ul.style.backgroundColor = "";
    });

    ul.addEventListener("drop", (e) => {
      e.preventDefault();
      if (dragged) {
        ul.appendChild(dragged);
        makeDraggable(dragged);

        const taskId = parseInt(dragged.getAttribute("data-id"));
        let task = Data.tasks.find((t) => t.id === taskId);

        if (task) {
          if (ul.id === "todo") {
            task.status = "Pending";
          } else if (ul.id === "doing") {
            task.status = "In Progress";
          } else if (ul.id === "done") {
            task.status = "Done";
          }
          localStorage.setItem("tasks", JSON.stringify(Data.tasks));
        }
      }
      ul.style.backgroundColor = "";
    });
  });
}


// Attendance center (omar)
function renderAttendance() {
  const tbody = document.querySelector("#attendance-table tbody");
  if (!tbody) return;

  const loggedEmployeeID = parseInt(localStorage.getItem("loggedEmployeeID"));
  const myRecords = Data.attendanceRecords.filter(r => r.employeeId === loggedEmployeeID);

  tbody.innerHTML = "";
  myRecords.forEach(record => {
    let tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${record.employeeId}</td>
      <td>${getEmployeeByID(record.employeeId)?.name || ""}</td>
      <td>${record.date}</td>
      <td>${record.status}</td>
      <td>${record.notes || ""}</td>
    `;
    tbody.appendChild(tr);
  });
}

// Requests  (waled & omar)
function renderRequests() {
  const tbody = document.querySelector("#requests-table tbody");
  if (!tbody) return;

  const loggedEmployeeID = parseInt(localStorage.getItem("loggedEmployeeID"));
  const myRequests = Data.requests.filter(r => r.employeeId === loggedEmployeeID);

  tbody.innerHTML = "";
  myRequests.forEach(req => {
    let tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${req.type}</td>
      <td>${req.date}</td>
      <td>${req.notes}</td>
      <td>${req.status}</td>
    `;
    tbody.appendChild(tr);
  });
}

function renderQuota() {
  const ul = document.getElementById("quota-list");
  if (!ul) return;

  const loggedEmployeeID = parseInt(localStorage.getItem("loggedEmployeeID"));
  const myRequests = Data.requests.filter(r => r.employeeId === loggedEmployeeID);

  const counts = {};
  myRequests.forEach(r => {
    counts[r.type] = (counts[r.type] || 0) + 1;
  });

  ul.innerHTML = "";
  Object.keys(counts).forEach(type => {
    let li = document.createElement("li");
    li.className = "list-group-item";
    li.textContent = `${type}: ${counts[type]} requests`;
    ul.appendChild(li);
  });
}

// add New Request  (omar)
const requestForm = document.getElementById("request-form");
if (requestForm) {
  requestForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const type = document.getElementById("request-type").value;
    const date = document.getElementById("request-date").value;
    const notes = document.getElementById("request-details").value;

    const newRequest = {
      id: Date.now(),
      employeeId: parseInt(localStorage.getItem("loggedEmployeeID")),
      type,
      date,
      notes,
      status: "Pending"
    };

    Data.requests.push(newRequest);
    saveDataToStorage();

    renderRequests();
    renderQuota();

    requestForm.reset();
  });
}

const currentDate = document.getElementById("request-date");

if (currentDate) {
  const today = new Date().toISOString().split("T")[0];
  currentDate.setAttribute("min", today);
}
const tabs = document.querySelectorAll("#center-tabs .nav-link");
const sections = document.querySelectorAll(".center-section");

tabs.forEach((tab, index) => {
  tab.style.cursor = "pointer";

  tab.addEventListener("click", () => {
    sections.forEach(sec => sec.style.display = "none");
    tabs.forEach(t => t.classList.remove("active"));

    tab.classList.add("active");
    sections[index].style.display = "block";
  });
});
