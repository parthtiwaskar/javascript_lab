document.getElementById("gymForm").addEventListener("submit", function (event) {
  event.preventDefault();

  let name = document.getElementById("name").value.trim();
  let age = document.getElementById("age").value;
  let phone = document.getElementById("phone").value.trim();
  let membership = document.getElementById("membership").value;
  let gender = document.querySelector('input[name="gender"]:checked');
  let message = document.getElementById("message");

  // Validation
  if (name === "") {
    message.textContent = "Please enter your name.";
    return;
  }

  if (age === "" || age < 16 || age > 80) {
    message.textContent = "Please enter a valid age between 16 and 80.";
    return;
  }

  if (!/^[0-9]{10}$/.test(phone)) {
    message.textContent = "Please enter a valid 10-digit phone number.";
    return;
  }

  if (!gender) {
    message.textContent = "Please select your gender.";
    return;
  }

  if (membership === "") {
    message.textContent = "Please select a membership.";
    return;
  }

  // Success
  message.textContent = "Admission submitted successfully!";

  // Clear form
  document.getElementById("gymForm").reset();
});
