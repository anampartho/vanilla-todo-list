// Task List
let tasks = [];

// Pending Tasks
let taskCount = document.querySelector(".task-count");

function updatePendingCount() {
  let count = 0;
  for (const task of tasks) {
    if (!task.completed) {
      count++;
    }
  }

  taskCount.innerHTML = count;
}

// Search
let searchInput = document.getElementById("search");
searchInput.addEventListener("keyup", filterTasks);

function filterTasks(e) {
  let output = "";

  for (const task of tasks) {
    if (task.details.indexOf(e.target.value) >= 0) {
      output += `
      <div class="panel-block${
        task.completed ? " completed" : ""
      }" data-taskid="${task.id}">
        <a class="complete">Complete</a>
        ${task.details}
        <a class="remove-task">Remove</a>
      </div>
    `;
    }

    tasksDiv.innerHTML = output;
  }
}

// Tasks Div
let tasksDiv = document.getElementById("tasks");

// Sort Tasks buttons
let sortButtons = document.querySelectorAll(".panel-tabs a");

sortButtons.forEach((button) => {
  button.addEventListener("click", showTasks);
});

// Add Task
let addTaskButton = document.getElementById("add-task-button");
addTaskButton.addEventListener("click", addtask);

// Task input
let taskInput = document.getElementById("new-task-input");
taskInput.addEventListener("keyup", addtask);

function addtask(e) {
  let taskValue = taskInput.value;

  if (e.keyCode === 13 || e.type === "click") {
    if (!taskValue) {
      console.log("Can not be emoty");
      return;
    }
    tasks.push({
      details: taskValue,
      completed: false,
      id: Date.now(),
    });

    taskInput.value = "";

    localStorage.setItem("tasks", JSON.stringify(tasks));
  }
  showTasks();
}

// Update Tasks
function showTasks(e) {
  let output = "";
  let items = "all";

  // Check if this function was fired by an event
  if (e) {
    items = e.target.dataset.items;

    sortButtons.forEach((button) => {
      button.classList.remove("is-active");
      if (items === button.dataset.items) {
        button.classList.add("is-active");
      }
    });
  }

  for (const task of tasks) {
    output += `
      <div class="panel-block${
        task.completed ? " completed" : ""
      }" data-taskid="${task.id}">
        <a class="complete">Complete</a>
        ${task.details}
        <a class="remove-task">Remove</a>
      </div>
    `;
  }
  tasksDiv.innerHTML = output;
}

// Complete or incomplete task
document.addEventListener("click", completeTask);
document.addEventListener("click", removeTask);

// Compelete Task Function
function completeTask(e) {
  if (e.target && e.target.classList.value === "complete") {
    e.stopPropagation();
    let taskId = Number(e.target.parentNode.dataset.taskid);

    for (const task of tasks) {
      if (task.id === taskId) {
        task.completed = !task.completed;
      }
    }

    localStorage.setItem("tasks", JSON.stringify(tasks));
    showTasks();
    updatePendingCount();
  }
}

// Remove Task
function removeTask(e) {
  if (e.target && e.target.classList.value === "remove-task") {
    e.stopPropagation();
    let taskId = Number(e.target.parentNode.dataset.taskid);

    for (let i = tasks.length - 1; i >= 0; i--) {
      if (taskId === tasks[i].id) {
        tasks.splice(i, 1);
      }
    }

    localStorage.setItem("tasks", JSON.stringify(tasks));
    showTasks();
    updatePendingCount();
  }
}

function init() {
  if (localStorage.getItem("tasks")) {
    tasks = JSON.parse(localStorage.getItem("tasks"));
  }

  showTasks();
  updatePendingCount();
}

init();
