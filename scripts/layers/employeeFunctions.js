// import { getNavbar } from "../components/navbar.js";
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

// automatically load when window is ready
window.addEventListener("load", async () => {
  Data = await loadDataFromStorage();
  loggedEmployee = getEmployeeByID(localStorage.getItem("loggedEmployeeID"));
  onPageLoad(loggedEmployee);

  renderTasks();
  renderAttendance();
  renderRequests();
  renderQuota();
});

// ---------------- Tabs Functionality ----------------
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

// ---------------- Load & Get Data ----------------
const saveDataToStorage = () => {
  localStorage.setItem("requests", JSON.stringify(Data.requests));
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
  const myTasks = Data.tasks.filter((t) => Number(t.employeeId) === loggedEmployeeID);

  document.getElementById("Pending").innerHTML = "";
  document.getElementById("In Progress").innerHTML = "";
  document.getElementById("Completed").innerHTML = "";


  myTasks.forEach((task) => {
    let li = document.createElement("li");
    li.className = "bg-primary-subtle rounded p-2 my-2";
    li.innerHTML = `
      <h5 class="fw-bold emp-title">${task.title}</h5>
      <h6 class="mb-2 fst-italic">${task.dueDate}</h6>
      <p>${task.description}</p>`;

    li.setAttribute("data-id", task.id);

    makeDraggable(li);

    if (task.status === "Pending") {
      document.getElementById("Pending").appendChild(li);
    } else if (task.status === "In Progress") {
      document.getElementById("In Progress").appendChild(li);
    } else {
      document.getElementById("Completed").appendChild(li);
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
          if (ul.id === "Pending") {
            task.status = "Pending";
          } else if (ul.id === "In Progress") {
            task.status = "In Progress";
          } else if (ul.id === "Completed") {
            task.status = "Completed";
          }
          localStorage.setItem("tasks", JSON.stringify(Data.tasks));
        }
      }
      ul.style.backgroundColor = "";
    });
  });
  updateTaskView();
  paginationEnable("pagination-requests", "requests-table-body", 5);
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

  paginationEnable("pagination-attendance", "attendance-table-body", 5);
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
    li.className = "list-group-item request";
    li.innerHTML = `<span class="emp-name">${type}:</span> ${counts[type]} requests`;
    ul.appendChild(li);
  });
}
const currentDate = document.getElementById("request-date");

if (currentDate) {
  const today = new Date().toISOString().split("T")[0];
  currentDate.setAttribute("min", today);
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

// functions to sort according to priorty, status (omar)
// pending employee-tasks
const getPendingTasks = (empID) => {
  return Data.tasks.filter(task => task.employeeId == empID)
    .filter(task => task.status == "Pending")
    .sort((taskA, taskB) => taskA.priorty - taskB.priorty);
}
// in-progress employee-tasks
const getInProgressTasks = (empID) => {
  return Data.tasks.filter(task => task.employeeId == empID)
    .filter(task => task.status == "In Progress")
    .sort((taskA, taskB) => taskA.priorty - taskB.priorty);;
}
// completed employee-tasks
const getCompletedTasks = (empID) => {
  return Data.tasks.filter(task => task.employeeId == empID)
    .filter(task => task.status == "Completed")
    .sort((taskA, taskB) => taskA.priorty - taskB.priorty);;
}

const updateTaskView = () => {
  orderTasksInStatusContainer("Pending");
  orderTasksInStatusContainer("In Progress");
  orderTasksInStatusContainer("Completed");
}

const orderTasksInStatusContainer = (containerID) => {
  let taskContainer = "";
  let viewedTasks = [];
  
  switch (containerID) {
    case "Pending":
      taskContainer = document.getElementById("Pending");
      viewedTasks = getPendingTasks(loggedEmployee.id);
      break;
    case "In Progress":
      taskContainer = document.getElementById("In Progress");
      viewedTasks = getInProgressTasks(loggedEmployee.id);
      break;
    case "Completed":
      taskContainer = document.getElementById("Completed");
      viewedTasks = getCompletedTasks(loggedEmployee.id);
      break;
    default:
      taskContainer = document.getElementById("Pending");
      viewedTasks = getPendingTasks(loggedEmployee.id);
  }

  // sort tasks by priority (1 = high, 3 = low)
  viewedTasks.sort((a, b) => a.priority - b.priority);

  taskContainer.innerHTML = "";
  
  viewedTasks.forEach((task) => {
    let taskPriority = "";
    switch (task.priority) {
      case 1:
        taskPriority = "High";
        break;
      case 2:
        taskPriority = "Medium";
        break;
      default:
        taskPriority = "Low";
    }

    let li = document.createElement("li");
    li.className = "bg-primary-subtle rounded p-2 my-2";
    li.innerHTML = `
      <h6 class="fw-bold emp-title task-level-${taskPriority.toLowerCase()}">${taskPriority}</h6>
      <h5 class="fw-bold emp-title">${task.title}</h5>
      <h6 class="mb-2 fst-italic">${task.dueDate}</h6>
      <p>${task.description}</p>`;

    li.setAttribute("data-id", task.id);

    makeDraggable(li);

    taskContainer.appendChild(li);
  });
}