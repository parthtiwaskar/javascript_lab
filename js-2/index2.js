function calculateGrade() {
  var name = document.getElementById("name").value;
  var marks = document.getElementById("marks").value;
  if (marks > 100 && marks < 0) {
    alert("Please enter a valid score between 0 and 100.");
  }

  if (marks >= 90 && marks <= 100) {
    document.getElementById("result").innerHTML = `
    <div class="result"> ${name} has scored an <strong>A+</strong> grade.</div>
  `;
  } else if (marks >= 80 && marks < 90) {
    document.getElementById("result").innerHTML = `
    <div class="result"> ${name} has scored a <strong>A</strong> grade.</div>
  `;
  } else if (marks >= 66 && marks < 80) {
    document.getElementById("result").innerHTML = `
    <div class="result"> ${name} has scored a <strong>B</strong> grade.</div>
  `;
  } else if (marks >= 50 && marks < 65) {
    document.getElementById("result").innerHTML = `
    <div class="result"> ${name} has scored a <strong>C</strong> grade.</div>
  `;
  } else if (marks >= 0 && marks < 50) {
    document.getElementById("result").innerHTML = `
    <div class="result"> ${name} has scored an <strong>F</strong> grade.</div>
  `;
  } else {
    alert("Please enter a valid score between 0 and 100.");
  }
}
