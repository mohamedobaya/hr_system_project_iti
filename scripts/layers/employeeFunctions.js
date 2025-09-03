// import { getNavbar } from "../components/navbar.js";
import { paginationEnable } from "../components/pagination.js";
import { loadDataFromStorage, onPageLoad } from "../components/reusableFunctions.js";
import { getEmployeeByID } from "../components/reusableFunctions.js";

let Data = {
  employees: [],
  attendanceRecords: [],
  tasks: [],
  requests: [],
  payrolls: [],
};
let loggedEmployee = {};

// ------------------- Load Page -------------------
window.addEventListener("load", async () => {
  Data = await loadDataFromStorage();
  loggedEmployee = getEmployeeByID(localStorage.getItem("loggedEmployeeID"));
  onPageLoad(loggedEmployee);

  renderTasks();
  renderAttendance();
  renderRequests();
  renderQuota();
});

// ------------------- Tabs Functionality -------------------
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

// Save Data 
const saveDataToStorage = () => {
  localStorage.setItem("requests", JSON.stringify(Data.requests));
  localStorage.setItem("tasks", JSON.stringify(Data.tasks));
};

//  Drag & Drop  (waled)
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

//   Tasks  (waled)
const sortByPriority = (a, b) => {
  const priorityA = a.priority || 3; 
  const priorityB = b.priority || 3;
  return priorityA - priorityB;
};

const getTasksByStatus = (empID, status) => {
  return Data.tasks
    .filter(t => t.employeeId == empID && t.status === status)
    .sort(sortByPriority);
};
const renderTasks = () => {
  const loggedEmployeeID = parseInt(localStorage.getItem("loggedEmployeeID"));
  ["Pending", "In Progress", "Completed"].forEach(status => {
    const container = document.getElementById(status);
    if (!container) return;
    container.innerHTML = "";
    getTasksByStatus(loggedEmployeeID, status).forEach(task => {
      const li = document.createElement("li");
      li.className = "bg-primary-subtle rounded p-2 my-2";

      let taskPriority = task.priority === 1 ? "High" : task.priority === 2 ? "Medium" : "Low";

      li.innerHTML = `
        <h6 class="fw-bold emp-title task-level-${taskPriority.toLowerCase()}">${taskPriority}</h6>
        <h5 class="fw-bold emp-title">${task.title}</h5>
        <h6 class="mb-2 fst-italic">${task.dueDate}</h6>
        <p>${task.description}</p>
      `;

      li.setAttribute("data-id", task.id);
      makeDraggable(li);
      container.appendChild(li);
    });
  });

  // Drag & Drop Events (waled)
  document.querySelectorAll("ul.list-unstyled").forEach((ul) => {
    ul.addEventListener("dragover", (e) => {
      e.preventDefault();
      ul.style.backgroundColor = "#e0f7fa";
    });
    ul.addEventListener("dragleave", () => ul.style.backgroundColor = "");
    ul.addEventListener("drop", (e) => {
      e.preventDefault();
      if (dragged) {
        ul.appendChild(dragged);
        makeDraggable(dragged);

        const taskId = parseInt(dragged.getAttribute("data-id"));
        const task = Data.tasks.find(t => t.id === taskId);
        if (task) {
          task.status = ul.id;
          saveDataToStorage();
          renderTasks();
        }
      }
      ul.style.backgroundColor = "";
    });
  });
};

// Attendance (omar)
function renderAttendance() {
  const tbody = document.querySelector("#attendance-table tbody");
  if (!tbody) return;
  const loggedEmployeeID = parseInt(localStorage.getItem("loggedEmployeeID"));
  const records = Data.attendanceRecords.filter(r => r.employeeId === loggedEmployeeID);

  tbody.innerHTML = "";
  records.forEach(record => {
    const tr = document.createElement("tr");
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

// Requests (omar)
function renderRequests() {
  const tbody = document.querySelector("#requests-table tbody");
  if (!tbody) return;
  const loggedEmployeeID = parseInt(localStorage.getItem("loggedEmployeeID"));
  const myRequests = Data.requests.filter(r => r.employeeId === loggedEmployeeID);

  tbody.innerHTML = "";
  myRequests.forEach(req => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${req.type}</td>
      <td>${req.date}</td>
      <td>${req.notes}</td>
      <td>${req.status}</td>
    `;
    tbody.appendChild(tr);
  });
}

// Quota  (waled, omar)
function renderQuota() {
  const ul = document.getElementById("quota-list");
  if (!ul) return;
  const loggedEmployeeID = parseInt(localStorage.getItem("loggedEmployeeID"));
  const myRequests = Data.requests.filter(r => r.employeeId === loggedEmployeeID);

  const counts = {};
  myRequests.forEach(r => counts[r.type] = (counts[r.type] || 0) + 1);

  ul.innerHTML = "";
  Object.keys(counts).forEach(type => {
    const li = document.createElement("li");
    li.className = "list-group-item request";
    li.innerHTML = `<span class="emp-name">${type}:</span> ${counts[type]} requests`;
    ul.appendChild(li);
  });
}

// New Request  (omar)
const currentDate = document.getElementById("request-date");
if (currentDate) currentDate.setAttribute("min", new Date().toISOString().split("T")[0]);

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
