document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("concertForm");
    const fullName = document.getElementById("fullName");
    const email = document.getElementById("email");
    const phone = document.getElementById("phone");
    const ticketCategory = document.getElementById("ticketCategory");
    const terms = document.getElementById("terms");
    const passSummary = document.getElementById("passSummary");

    function showError(input, errorElementId, message) {
        if (input && input.classList) {
            input.classList.add("input-error");
        }
        const errorEl = document.getElementById(errorElementId);
        if (errorEl) {
            errorEl.textContent = message;
            errorEl.classList.add("visible");
        }
    }

    function clearError(input, errorElementId) {
        if (input && input.classList) {
            input.classList.remove("input-error");
        }
        const errorEl = document.getElementById(errorElementId);
        if (errorEl) {
            errorEl.textContent = "";
            errorEl.classList.remove("visible");
        }
    }

    fullName.addEventListener("input", () => clearError(fullName, "nameError"));
    email.addEventListener("input", () => clearError(email, "emailError"));
    phone.addEventListener("input", () => clearError(phone, "phoneError"));
    ticketCategory.addEventListener("change", () => clearError(ticketCategory, "ticketError"));
    terms.addEventListener("change", () => clearError(terms, "termsError"));

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

        // Validate Phone Number
        const phoneRegex = /^[0-9]{10}$/;
        const cleanPhone = phone.value.trim().replace(/\D/g, "");
        if (!phone.value.trim()) {
            showError(phone, "phoneError", "Please enter your phone number.");
            isValid = false;
        } else if (cleanPhone.length < 10) {
            showError(phone, "phoneError", "Please enter a valid 10-digit mobile number.");
            isValid = false;
        } else {
            clearError(phone, "phoneError");
        }

        // Validate Ticket Category
        if (!ticketCategory.value) {
            showError(ticketCategory, "ticketError", "Please select a ticket category.");
            isValid = false;
        } else {
            clearError(ticketCategory, "ticketError");
        }

        // Validate Terms Checkbox
        if (!terms.checked) {
            showError(terms, "termsError", "You must agree to event terms and streaming guidelines.");
            isValid = false;
        } else {
            clearError(terms, "termsError");
        }

        if (isValid) {
            const selectedPlatform = document.querySelector('input[name="platform"]:checked')?.value || "YouTube Live";
            const ticketPassId = "TKT-LIVE-" + Math.floor(100000 + Math.random() * 900000);

            const registration = {
                id: ticketPassId,
                name: fullName.value.trim(),
                email: email.value.trim(),
                phone: phone.value.trim(),
                ticket: ticketCategory.value,
                platform: selectedPlatform,
                newsletter: document.getElementById("newsletter").checked,
                registeredAt: new Date().toLocaleString()
            };

            // Save to LocalStorage
            const stored = JSON.parse(localStorage.getItem("concert_registrations") || "[]");
            stored.push(registration);
            localStorage.setItem("concert_registrations", JSON.stringify(stored));

            // Display success ticket pass
            passSummary.innerHTML = `
                <h4>✓ Concert Registration Confirmed!</h4>
                <div class="summary-details">
                    <p><strong>Digital Pass ID:</strong> ${ticketPassId}</p>
                    <p><strong>Attendee:</strong> ${registration.name}</p>
                    <p><strong>Ticket Type:</strong> ${registration.ticket}</p>
                    <p><strong>Streaming On:</strong> ${registration.platform}</p>
                    <p><strong>Access Link:</strong> Sent to ${registration.email}</p>
                </div>
            `;
            passSummary.classList.remove("hidden");

            // Reset form
            form.reset();
        }
    });
});
