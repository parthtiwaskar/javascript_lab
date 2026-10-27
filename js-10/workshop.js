document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("workshopForm");
    const fullName = document.getElementById("fullName");
    const studentId = document.getElementById("studentId");
    const email = document.getElementById("email");
    const workshopSelect = document.getElementById("workshopSelect");
    const sessions = document.getElementById("sessions");
    const bookingSummary = document.getElementById("bookingSummary");

    function showError(input, errorElementId, message) {
        input.classList.add("input-error");
        const errorEl = document.getElementById(errorElementId);
        errorEl.textContent = message;
        errorEl.classList.add("visible");
    }

    function clearError(input, errorElementId) {
        input.classList.remove("input-error");
        const errorEl = document.getElementById(errorElementId);
        errorEl.textContent = "";
        errorEl.classList.remove("visible");
    }

    // Input blur event listeners for immediate validation feedback
    fullName.addEventListener("input", () => clearError(fullName, "nameError"));
    studentId.addEventListener("input", () => clearError(studentId, "idError"));
    email.addEventListener("input", () => clearError(email, "emailError"));
    workshopSelect.addEventListener("change", () => clearError(workshopSelect, "workshopError"));
    sessions.addEventListener("input", () => clearError(sessions, "sessionsError"));

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        let isValid = true;

        // Validate Full Name
        if (!fullName.value.trim()) {
            showError(fullName, "nameError", "Please enter your full name.");
            isValid = false;
        } else {
            clearError(fullName, "nameError");
        }

        // Validate Student ID
        if (!studentId.value.trim()) {
            showError(studentId, "idError", "Please enter your student ID.");
            isValid = false;
        } else {
            clearError(studentId, "idError");
        }

        // Validate Email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.value.trim()) {
            showError(email, "emailError", "Please enter your email address.");
            isValid = false;
        } else if (!emailRegex.test(email.value.trim())) {
            showError(email, "emailError", "Please enter a valid email address.");
            isValid = false;
        } else {
            clearError(email, "emailError");
        }

        // Validate Workshop
        if (!workshopSelect.value) {
            showError(workshopSelect, "workshopError", "Please select a workshop topic.");
            isValid = false;
        } else {
            clearError(workshopSelect, "workshopError");
        }

        // Validate Sessions
        const sessionCount = parseInt(sessions.value, 10);
        if (isNaN(sessionCount) || sessionCount < 1) {
            showError(sessions, "sessionsError", "Please enter at least 1 session.");
            isValid = false;
        } else {
            clearError(sessions, "sessionsError");
        }

        if (isValid) {
            // Generate booking confirmation
            const bookingId = "WKSP-" + Math.floor(100000 + Math.random() * 900000);
            const userBooking = {
                id: bookingId,
                name: fullName.value.trim(),
                studentId: studentId.value.trim(),
                email: email.value.trim(),
                topic: workshopSelect.value,
                sessions: sessionCount,
                bookedAt: new Date().toLocaleString()
            };

            // Store in LocalStorage
            const stored = JSON.parse(localStorage.getItem("workshop_bookings") || "[]");
            stored.push(userBooking);
            localStorage.setItem("workshop_bookings", JSON.stringify(stored));

            // Show confirmation UI
            bookingSummary.innerHTML = `
                <h4>✓ Seat Reserved Successfully!</h4>
                <div class="summary-details">
                    <p><strong>Booking Ref:</strong> ${bookingId}</p>
                    <p><strong>Attendee:</strong> ${userBooking.name} (${userBooking.studentId})</p>
                    <p><strong>Topic:</strong> ${userBooking.topic}</p>
                    <p><strong>Total Sessions:</strong> ${userBooking.sessions}</p>
                    <p><strong>Confirmation sent to:</strong> ${userBooking.email}</p>
                </div>
            `;
            bookingSummary.classList.remove("hidden");

            // Reset form inputs except sessions default
            form.reset();
            sessions.value = "1";
        }
    });
});
