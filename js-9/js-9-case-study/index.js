const storageKey = "scheduleSession";
const mockSchedule = [
  { day: "Monday", begin: "8:00 AM", end: "10:00 AM", topic: "HTML Basics" },
  { day: "Tuesday", begin: "10:00 AM", end: "12:00 PM", topic: "CSS Styling" },
  { day: "Wednesday", begin: "2:00 PM", end: "4:00 PM", topic: "JavaScript" },
  {
    day: "Thursday",
    begin: "9:00 AM",
    end: "11:00 AM",
    topic: "DOM Manipulation",
  },
  {
    day: "Friday",
    begin: "11:00 AM",
    end: "1:00 PM",
    topic: "Web Development",
  },
];

const storedSchedule = localStorage.getItem(storageKey);
let schedule = storedSchedule ? JSON.parse(storedSchedule) : mockSchedule;

let day = document.getElementById("day");
let begin = document.getElementById("begin");
let end = document.getElementById("end");
let topic = document.getElementById("topic");

let addBtn = document.getElementById("addBtn");
let storeBtn = document.getElementById("storeBtn");
let clearBtn = document.getElementById("clearBtn");

displaySchedule();

function saveSchedule() {
  localStorage.setItem(storageKey, JSON.stringify(schedule));
}

storeBtn.addEventListener("click", function () {
  saveSchedule();
  alert("Session stored successfully!");
});

// Add Schedule
addBtn.addEventListener("click", function () {
  if (
    day.value === "" ||
    begin.value === "" ||
    end.value === "" ||
    topic.value === ""
  ) {
    alert("Please fill all the fields!");
    return;
  }

  let newSchedule = {
    day: day.value,
    begin: begin.value,
    end: end.value,
    topic: topic.value,
  };

  schedule.push(newSchedule);

  saveSchedule();
  displaySchedule();

  alert("Schedule added successfully!");

  // Clear input boxes
  day.value = "";
  begin.value = "";
  end.value = "";
  topic.value = "";
});

// Display Schedule
function displaySchedule() {
  let table = document.getElementById("scheduleBody");

  table.innerHTML = "";

  schedule.forEach(function (item, index) {
    table.innerHTML += `
            <tr>
                <td>${item.day}</td>
                <td>${item.begin}</td>
                <td>${item.end}</td>
                <td>${item.topic}</td>
                <td>
                    <button onclick="deleteSchedule(${index})">
                        Delete
                    </button>
                </td>
            </tr>
        `;
  });
}

// Delete Schedule
function deleteSchedule(index) {
  schedule.splice(index, 1);

  saveSchedule();
  displaySchedule();

  alert("Schedule deleted!");
}

// Clear All
clearBtn.addEventListener("click", function () {
  schedule = [];
  localStorage.removeItem(storageKey);

  displaySchedule();

  alert("All schedules cleared!");
});
