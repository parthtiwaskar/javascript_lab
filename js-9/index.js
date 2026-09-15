const theme = document.getElementById("theme");

const saveLocal = document.getElementById("saveLocal");
const saveSession = document.getElementById("saveSession");
const clearStorage = document.getElementById("clearStorage");

const localStorageData = document.getElementById("localStorageData");
const sessionStorageData = document.getElementById("sessionStorageData");

// Theme change
theme.addEventListener("change", function () {
  let selectedTheme = theme.value;

  if (selectedTheme === "dark") {
    document.body.classList.add("dark");
  } else {
    document.body.classList.remove("dark");
  }

  localStorage.setItem("theme", selectedTheme);
});

// Save to LocalStorage
saveLocal.addEventListener("click", function () {
  localStorage.setItem("name", "Parth");

  displayData();

  alert("Data saved to LocalStorage");
});

// Save to SessionStorage
saveSession.addEventListener("click", function () {
  sessionStorage.setItem("name", "Parth");

  displayData();

  alert("Data saved to SessionStorage");
});

// Clear Storage
clearStorage.addEventListener("click", function () {
  localStorage.clear();
  sessionStorage.clear();

  displayData();

  alert("Storage cleared");
});

// Display stored data
function displayData() {
  let localData = localStorage.getItem("name");
  let sessionData = sessionStorage.getItem("name");

  localStorageData.textContent = "LocalStorage: " + (localData || "No data");

  sessionStorageData.textContent =
    "SessionStorage: " + (sessionData || "No data");
}

// Load saved theme
let savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {
  document.body.classList.add("dark");
  theme.value = "dark";
} else {
  theme.value = "light";
}

// Display data when page loads
displayData();
