function analyzeMarks() {
  let input = document.getElementById("marksInput").value.trim();
  let error = document.getElementById("error");

  error.innerHTML = "";

  // Check empty input
  if (input === "") {
    error.innerHTML = "Please enter marks.";
    return;
  }

  // MAP: Convert input strings into numbers
  let marks = input.split(",").map(Number);

  // FILTER: Check only valid numbers
  let validMarks = marks.filter(function (mark) {
    return !isNaN(mark) && mark >= 0 && mark <= 100;
  });

  // Check invalid input
  if (validMarks.length !== marks.length) {
    error.innerHTML = "Enter valid marks between 0 and 100.";
    return;
  }

  // FOREACH: Display marks
  let display = "";

  marks.forEach(function (mark) {
    display += mark + " ";
  });

  document.getElementById("marksArray").innerHTML = display;

  // REDUCE: Find maximum
  let maximum = marks.reduce(function (max, mark) {
    return mark > max ? mark : max;
  });

  // REDUCE: Find minimum
  let minimum = marks.reduce(function (min, mark) {
    return mark < min ? mark : min;
  });

  // Display results
  document.getElementById("maximum").innerHTML = maximum;
  document.getElementById("minimum").innerHTML = minimum;

  document.getElementById("maxMessage").innerHTML =
    "Highest mark is " + maximum + ".";

  document.getElementById("minMessage").innerHTML =
    "Lowest mark is " + minimum + ".";
}
