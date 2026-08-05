// vehicle.js
const form = document.getElementById('regForm');
const feedback = document.getElementById('feedback');

// Simple vehicle number regex (example: two letters, two digits, two letters, up to 4 digits)
const vehicleRegex = /^[A-Z]{2}\d{2}[A-Z]{2}\d{1,4}$/i;

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const owner = document.getElementById('ownerName').value.trim();
  const vehicleNo = document.getElementById('vehicleNo').value.trim();
  const model = document.getElementById('model').value.trim();
  const color = document.getElementById('color').value.trim();

  if (!owner || !vehicleNo || !model || !color) {
    feedback.textContent = 'All fields are required.';
    feedback.style.color = '#ff6b6b';
    return;
  }

  if (!vehicleRegex.test(vehicleNo)) {
    feedback.textContent = 'Invalid vehicle number format. Example: AB12CD3456';
    feedback.style.color = '#ff6b6b';
    return;
  }

  // Simulate successful registration
  feedback.textContent = `Vehicle '${vehicleNo}' registered successfully for ${owner}.`;
  feedback.style.color = '#4caf50';
  form.reset();
});
