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
  if (loggedEmployee == undefined) {
    window.location.href = "/pages/index.html";
  }
  navbar.innerHTML = getNavbar(
    loggedEmployee.role,
    loggedEmployee.name,
    loggedEmployee.preferences.theme
  );
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
  console.log("Loaded Data in employeeFunctions.js:", Data);
};

const getEmployeeByID = (empID) => {
  return Data.employees.filter((emp) => emp.id == empID)[0];
};

// Drag and Drop Functionality(waleed)
let dragged = null;

function makeDraggable(li) {
  li.setAttribute("draggable", "true");

  li.addEventListener("dragstart", (e) => {
    dragged = li;
    li.classList.add("dragging");
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", "");
  });

  li.addEventListener("dragend", (e) => {
    li.classList.remove("dragging");
    dragged = null;
  });
}

document.querySelectorAll("ul.list-unstyled").forEach((ul) => {
  ul.addEventListener("dragover", (e) => {
    e.preventDefault();
    ul.style.backgroundColor = "#e0f7fa";
  });

  ul.addEventListener("dragleave", (e) => {
    ul.style.backgroundColor = "";
  });

  ul.addEventListener("drop", (e) => {
    e.preventDefault();
    if (dragged) {
      ul.appendChild(dragged);
      makeDraggable(dragged);
    }
    ul.style.backgroundColor = "";
  });
});
// get task condition from json(waleed)
window.addEventListener("load", () => {
  const loggedEmployeeID = parseInt(localStorage.getItem("loggedEmployeeID"));
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const myTasks = tasks.filter((t) => t.employeeId === loggedEmployeeID);

  myTasks.forEach((task) => {
    let li = document.createElement("li");
    li.className = "bg-primary-subtle rounded p-2 my-2";
    li.textContent = task.description;
    makeDraggable(li);

    if (task.status === "Pending") {
      document.getElementById("todo").appendChild(li);
    } else if (task.status === "In Progress") {
      document.getElementById("doing").appendChild(li);
    } else {
      document.getElementById("done").appendChild(li);
    }
  });
});

//Attendance Center(omar)

const loadAttendanceTable = () => {
  const loggedEmployeeID = parseInt(localStorage.getItem("loggedEmployeeID"));
  const attendanceRecords = JSON.parse(
    localStorage.getItem("attendanceRecords") || "[]"
  );
  const employees = JSON.parse(localStorage.getItem("employees") || "[]");

  const tableBody = document.querySelector("#attendance-table tbody");
  if (!tableBody) return;

  tableBody.innerHTML = "";

  const myRecords = attendanceRecords.filter(
    (r) => r.employeeId == loggedEmployeeID
  );

  myRecords.forEach((record) => {
    const employee = employees.find((e) => e.id == record.employeeId);

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${record.employeeId}</td>
      <td>${employee ? employee.name : "Unknown"}</td>
      <td>${record.date}</td>
      <td>${record.status}</td>
      <td>${record.notes || ""}</td>
    `;
    tableBody.appendChild(row);
  });
};

window.addEventListener("load", loadAttendanceTable);