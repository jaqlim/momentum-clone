// scripts.js
const timeEl = document.getElementById("time");
const dateEl = document.getElementById("date");
const temperatureEl = document.getElementById("temperature");
const locationEl = document.getElementById("location");
const quoteEl = document.getElementById("quote");
const authorEl = document.getElementById("author");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const nameInput = document.getElementById("nameInput");
const splashEl = document.querySelector(".splash");
const greetingEl = document.getElementById("greeting");
const todoToggle = document.getElementById("todoToggle");
const newTodoContainer = document.getElementById("newTodoContainer");
const newTaskInput = document.getElementById("newTaskInput");
const newTaskList = document.getElementById("newTaskList");

function updateGreeting(name) {
  const now = new Date();
  const hours = now.getHours();
  let greeting;

  if (hours >= 5 && hours < 12) {
    greeting = "Good Morning";
  } else if (hours >= 12 && hours < 18) {
    greeting = "Good Afternoon";
  } else {
    greeting = "Good Evening";
  }

  greetingEl.textContent = `${greeting}, ${name}!`;
  greetingEl.classList.remove("hidden");
  splashEl.classList.add("hidden");
}


nameInput.addEventListener("keydown", event => {
  if (event.key === "Enter" && nameInput.value.trim() !== "") {
    updateGreeting(nameInput.value.trim());
  }
});

function updateTime() {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const month = monthNames[now.getMonth()];
  const day = now.getDate();
  const year = now.getFullYear();

  timeEl.textContent = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  dateEl.textContent = `${month} ${day}, ${year}`;
}



function updateWeather() {
  const apiKey = "46890e5e9527949e6b3bf156ff3e693a";
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=Manila&appid=${apiKey}&units=metric`;

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      temperatureEl.textContent = `${Math.round(data.main.temp)}°C`;
      locationEl.textContent = data.name;
    });
}

function updateQuote() {
  const apiUrl = "https://api.quotable.io/random";

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      quoteEl.textContent = data.content;
      authorEl.textContent = `- ${data.author}`;
    });
}

function updateBackground() {
  const unsplashApiKey = "zLhfmMi-a74UFzlBy8uHaK9xp1H6SedHWW8IZb3rrB0";
  const apiUrl = `https://api.unsplash.com/photos/random?orientation=landscape&query=nature&client_id=${unsplashApiKey}`;

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      document.documentElement.style.backgroundImage = `url(${data.urls.regular})`;
    });
}

setInterval(() => {
  updateBackground();
  updateQuote();
}, 60 * 1000);

function addTask(taskText) {
  const task = document.createElement("li");
  task.textContent = taskInput.value;
  taskList.appendChild(task);
  taskInput.value = "";
  saveTasks();
}

function createNewTask(taskText) {
  const task = document.createElement("li");
  const checkbox = document.createElement("input");
  const label = document.createElement("span");
  const deleteButton = document.createElement("button");

  checkbox.type = "checkbox";
  checkbox.addEventListener("change", () => {
    task.classList.toggle("checked");
  });

  label.textContent = taskText;
  label.contentEditable = "true";

  deleteButton.textContent = "X";
  deleteButton.addEventListener("click", () => {
    task.remove();
  });

  task.appendChild(checkbox);
  task.appendChild(label);
  task.appendChild(deleteButton);
  newTaskList.appendChild(task);

  saveNewTasks();
}

function toggleTodo() {
  newTodoContainer.classList.toggle("hidden");
}

todoToggle.addEventListener("click", toggleTodo);

newTaskInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && newTaskInput.value.trim() !== "") {
    createNewTask(newTaskInput.value);
    newTaskInput.value = "";
  }
});

function saveName(name) {
  localStorage.setItem("name", name);
}

function loadName() {
  return localStorage.getItem("name");
}

function saveTasks() {
  const tasks = Array.from(taskList.children).map(task => task.textContent);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem("tasks"));
  return tasks || [];
}

function saveNewTasks() {
  const tasks = Array.from(newTaskList.children).map(task => ({
    text: task.textContent,
    checked: task.classList.contains("checked"),
  }));
  localStorage.setItem("newTasks", JSON.stringify(tasks));
}

function loadNewTasks() {
  const tasks = JSON.parse(localStorage.getItem("newTasks"));
  return tasks || [];
}

function init() {
  updateTime();
  updateWeather();
  updateQuote();
  updateBackground();
  setInterval(updateTime, 1000);

  taskInput.addEventListener("keydown", event => {
    if (event.key === "Enter" && taskInput.value.trim() !== "") {
      addTask();
    }
  });

  const storedName = loadName();
  if (storedName) {
    greetUser(storedName);
  }
  
  const storedTasks = loadTasks();
  storedTasks.forEach(task => {
    addTask(task);
  });

  const storedNewTasks = loadNewTasks();
  storedNewTasks.forEach(task => {
    createNewTask(task.text, task.checked);
  });
}

init();
