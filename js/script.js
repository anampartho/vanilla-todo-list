// Task List Array
let tasks = [];

// Pending Tasks Span
let taskCount = document.querySelector(".task-count");

// Complete or incomplete task
document.addEventListener("click", completeTask);
document.addEventListener("click", removeTask);

// Search Input Field
let searchInput = document.getElementById("search");
searchInput.addEventListener("keyup", filterTasks);

// Tasks Div
let tasksDiv = document.getElementById("tasks");

// Add Task Button
let addTaskButton = document.getElementById("add-task-button");
addTaskButton.addEventListener("click", addtask);

// Task input
let taskInput = document.getElementById("new-task-input");
taskInput.addEventListener("keyup", addtask);

/**
 * Gets the count of pending tasks and
 * updates the UI
 */
function updatePendingCount() {
  let count = 0;
  for (const task of tasks) {
    if (!task.completed) {
      count++;
    }
  }

  taskCount.innerHTML = count;
}

/**
 * Filter the Task list based on user input
 * @param  {Object} event Even object for later use
 */
function filterTasks(e) {
  let output = "";

  for (const task of tasks) {
    if (task.details.toLowerCase().indexOf(e.target.value.toLowerCase()) >= 0) {
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

/**
 * Add New tasks to the list
 * @param  {Object} event Even object for later use
 */
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

/**
 * Show tasks in front end
 * @param  {Object} event Even object for later use
 */
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

/**
 * Complete a prticualr task
 * @param  {Object} event Even object for later use
 */
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

/**
 * Remove a particular task
 * @param  {Object} event Even object for later use
 */
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

// Init Function
function init() {
  if (localStorage.getItem("tasks")) {
    tasks = JSON.parse(localStorage.getItem("tasks"));
  }

  showTasks();
  updatePendingCount();
}

init();
