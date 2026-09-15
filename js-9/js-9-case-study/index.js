let schedule = [];

let day = document.getElementById("day");
let begin = document.getElementById("begin");
let end = document.getElementById("end");
let topic = document.getElementById("topic");

let addBtn = document.getElementById("addBtn");
let clearBtn = document.getElementById("clearBtn");

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

  displaySchedule();

  alert("Schedule deleted!");
}

// Clear All
clearBtn.addEventListener("click", function () {
  schedule = [];

  displaySchedule();

  alert("All schedules cleared!");
});
