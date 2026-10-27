document.addEventListener("DOMContentLoaded", () => {
    // ==========================================
    // 1. TAB SWITCHING
    // ==========================================
    const tabButtons = document.querySelectorAll(".tab-btn");
    const tabPanels = document.querySelectorAll(".tab-panel");

    tabButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            tabButtons.forEach(b => b.classList.remove("active"));
            tabPanels.forEach(p => p.classList.remove("active"));

            btn.classList.add("active");
            const targetId = btn.getAttribute("data-target");
            const panel = document.getElementById(targetId);
            if (panel) panel.classList.add("active");
        });
    });

    // ==========================================
    // 2. FOOD ORDER MANAGER (Images 2 & 4)
    // ==========================================
    const defaultOrders = [
        { id: 1001, customer: "Aarav Sharma", item: "Margherita Pizza", qty: 2, amount: 600, status: "Preparing" },
        { id: 1002, customer: "Priya Patil", item: "Veg Burger", qty: 1, amount: 180, status: "Ready" },
        { id: 1003, customer: "Rohan Mehta", item: "Paneer Biryani", qty: 2, amount: 500, status: "Delivered" },
        { id: 1004, customer: "Sneha Joshi", item: "White Sauce Pasta", qty: 1, amount: 250, status: "Preparing" },
        { id: 1005, customer: "Aditya Kulkarni", item: "Masala Dosa", qty: 2, amount: 240, status: "Delivered" },
        { id: 1006, customer: "Hussain", item: "Pasta", qty: 2, amount: 400, status: "Preparing" },
        { id: 1007, customer: "Tyson", item: "Dosa", qty: 1, amount: 100, status: "Preparing" }
    ];

    let orders = [];
    try {
        const stored = localStorage.getItem("food_orders_data");
        orders = stored ? JSON.parse(stored) : [...defaultOrders];
    } catch (e) {
        orders = [...defaultOrders];
    }

    const orderForm = document.getElementById("orderForm");
    const customerName = document.getElementById("customerName");
    const foodItem = document.getElementById("foodItem");
    const quantity = document.getElementById("quantity");
    const totalAmount = document.getElementById("totalAmount");
    const orderSuccessMsg = document.getElementById("orderSuccessMsg");
    const ordersTableBody = document.getElementById("ordersTableBody");
    const totalOrdersCount = document.getElementById("totalOrdersCount");
    const totalSalesAmount = document.getElementById("totalSalesAmount");
    const viewOrdersBtn = document.getElementById("viewOrdersBtn");

    function saveOrders() {
        localStorage.setItem("food_orders_data", JSON.stringify(orders));
    }

    function renderOrdersTable() {
        if (!ordersTableBody) return;
        ordersTableBody.innerHTML = "";

        if (orders.length === 0) {
            ordersTableBody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align:center; padding: 20px; color:#94a3b8;">
                        No orders currently placed.
                    </td>
                </tr>
            `;
            return;
        }

        orders.forEach(order => {
            const tr = document.createElement("tr");
            const statusClass = order.status ? order.status.toLowerCase() : "preparing";
            const formattedAmount = "₹" + Number(order.amount).toLocaleString("en-IN");

            tr.innerHTML = `
                <td class="order-id">${order.id}</td>
                <td class="customer-name">${escapeHtml(order.customer)}</td>
                <td class="food-item">${escapeHtml(order.item)}</td>
                <td class="quantity">${order.qty}</td>
                <td class="total-amount">${formattedAmount}</td>
                <td class="order-status">
                    <span class="status-pill ${statusClass}" title="Click to cycle status" data-id="${order.id}">
                        ${order.status}
                    </span>
                </td>
            `;

            const pill = tr.querySelector(".status-pill");
            pill.addEventListener("click", () => cycleOrderStatus(order.id));

            ordersTableBody.appendChild(tr);
        });
    }

    function updateOrderStats() {
        if (!totalOrdersCount || !totalSalesAmount) return;
        totalOrdersCount.textContent = orders.length;
        const total = orders.reduce((sum, o) => sum + (Number(o.amount) || 0), 0);
        totalSalesAmount.textContent = "₹" + total.toLocaleString("en-IN");
    }

    function cycleOrderStatus(orderId) {
        const order = orders.find(o => o.id === orderId);
        if (!order) return;

        const nextStatus = {
            "Preparing": "Ready",
            "Ready": "Delivered",
            "Delivered": "Preparing"
        };
        order.status = nextStatus[order.status] || "Preparing";
        saveOrders();
        renderOrdersTable();
    }

    if (orderForm) {
        orderForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const cName = customerName.value.trim();
            const fItem = foodItem.value.trim();
            const qty = parseInt(quantity.value, 10);
            const amt = parseFloat(totalAmount.value);

            if (!cName || !fItem || isNaN(qty) || qty < 1 || isNaN(amt) || amt <= 0) {
                alert("Please fill all order fields with valid information.");
                return;
            }

            const maxId = orders.length > 0 ? Math.max(...orders.map(o => parseInt(o.id, 10))) : 1000;
            const newOrder = {
                id: maxId + 1,
                customer: cName,
                item: fItem,
                qty: qty,
                amount: amt,
                status: "Preparing"
            };

            orders.push(newOrder);
            saveOrders();
            renderOrdersTable();
            updateOrderStats();

            orderSuccessMsg.classList.remove("hidden");
            setTimeout(() => {
                orderSuccessMsg.classList.add("hidden");
            }, 3500);

            orderForm.reset();
            quantity.value = "1";
        });
    }

    if (viewOrdersBtn) {
        viewOrdersBtn.addEventListener("click", () => {
            viewOrdersBtn.style.transform = "rotate(180deg)";
            setTimeout(() => {
                viewOrdersBtn.style.transform = "rotate(0deg)";
            }, 300);
            renderOrdersTable();
            updateOrderStats();
        });
    }

    renderOrdersTable();
    updateOrderStats();

    // ==========================================
    // 3. CONCERT REGISTRATION (Image 3)
    // ==========================================
    const concertForm = document.getElementById("concertForm");
    const cFullName = document.getElementById("cFullName");
    const cEmail = document.getElementById("cEmail");
    const cPhone = document.getElementById("cPhone");
    const cTicketCategory = document.getElementById("cTicketCategory");
    const cTerms = document.getElementById("cTerms");
    const cPassSummary = document.getElementById("cPassSummary");

    function showErr(input, errId, msg) {
        if (input && input.classList) input.classList.add("input-error");
        const el = document.getElementById(errId);
        if (el) {
            el.textContent = msg;
            el.classList.add("visible");
        }
    }

    function clearErr(input, errId) {
        if (input && input.classList) input.classList.remove("input-error");
        const el = document.getElementById(errId);
        if (el) {
            el.textContent = "";
            el.classList.remove("visible");
        }
    }

    if (concertForm) {
        cFullName.addEventListener("input", () => clearErr(cFullName, "cNameError"));
        cEmail.addEventListener("input", () => clearErr(cEmail, "cEmailError"));
        cPhone.addEventListener("input", () => clearErr(cPhone, "cPhoneError"));
        cTicketCategory.addEventListener("change", () => clearErr(cTicketCategory, "cTicketError"));
        cTerms.addEventListener("change", () => clearErr(cTerms, "cTermsError"));

        concertForm.addEventListener("submit", (e) => {
            e.preventDefault();
            let valid = true;

            if (!cFullName.value.trim()) {
                showErr(cFullName, "cNameError", "Please enter your full name.");
                valid = false;
            } else {
                clearErr(cFullName, "cNameError");
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!cEmail.value.trim() || !emailRegex.test(cEmail.value.trim())) {
                showErr(cEmail, "cEmailError", "Please enter a valid email address.");
                valid = false;
            } else {
                clearErr(cEmail, "cEmailError");
            }

            const cleanPhone = cPhone.value.trim().replace(/\D/g, "");
            if (cleanPhone.length < 10) {
                showErr(cPhone, "cPhoneError", "Please enter a valid 10-digit phone number.");
                valid = false;
            } else {
                clearErr(cPhone, "cPhoneError");
            }

            if (!cTicketCategory.value) {
                showErr(cTicketCategory, "cTicketError", "Please select a ticket category.");
                valid = false;
            } else {
                clearErr(cTicketCategory, "cTicketError");
            }

            if (!cTerms.checked) {
                showErr(cTerms, "cTermsError", "You must agree to event terms and streaming guidelines.");
                valid = false;
            } else {
                clearErr(cTerms, "cTermsError");
            }

            if (valid) {
                const platform = document.querySelector('input[name="cPlatform"]:checked')?.value || "YouTube Live";
                const passId = "TKT-" + Math.floor(100000 + Math.random() * 900000);

                cPassSummary.innerHTML = `
                    <h4>✓ Registration Complete!</h4>
                    <p><strong>Digital Pass ID:</strong> ${passId}</p>
                    <p><strong>Attendee:</strong> ${escapeHtml(cFullName.value.trim())}</p>
                    <p><strong>Ticket:</strong> ${cTicketCategory.value}</p>
                    <p><strong>Streaming Platform:</strong> ${platform}</p>
                    <p><strong>Link:</strong> Dispatched to ${escapeHtml(cEmail.value.trim())}</p>
                `;
                cPassSummary.classList.remove("hidden");
                concertForm.reset();
            }
        });
    }

    // ==========================================
    // 4. WORKSHOP ENTRY (Image 1)
    // ==========================================
    const workshopForm = document.getElementById("workshopForm");
    const wFullName = document.getElementById("wFullName");
    const wStudentId = document.getElementById("wStudentId");
    const wEmail = document.getElementById("wEmail");
    const wWorkshopSelect = document.getElementById("wWorkshopSelect");
    const wSessions = document.getElementById("wSessions");
    const wBookingSummary = document.getElementById("wBookingSummary");

    if (workshopForm) {
        wFullName.addEventListener("input", () => clearErr(wFullName, "wNameError"));
        wStudentId.addEventListener("input", () => clearErr(wStudentId, "wIdError"));
        wEmail.addEventListener("input", () => clearErr(wEmail, "wEmailError"));
        wWorkshopSelect.addEventListener("change", () => clearErr(wWorkshopSelect, "wWorkshopError"));
        wSessions.addEventListener("input", () => clearErr(wSessions, "wSessionsError"));

        workshopForm.addEventListener("submit", (e) => {
            e.preventDefault();
            let valid = true;

            if (!wFullName.value.trim()) {
                showErr(wFullName, "wNameError", "Please enter your full name.");
                valid = false;
            } else {
                clearErr(wFullName, "wNameError");
            }

            if (!wStudentId.value.trim()) {
                showErr(wStudentId, "wIdError", "Please enter your student ID.");
                valid = false;
            } else {
                clearErr(wStudentId, "wIdError");
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!wEmail.value.trim() || !emailRegex.test(wEmail.value.trim())) {
                showErr(wEmail, "wEmailError", "Please enter a valid email address.");
                valid = false;
            } else {
                clearErr(wEmail, "wEmailError");
            }

            if (!wWorkshopSelect.value) {
                showErr(wWorkshopSelect, "wWorkshopError", "Please select a workshop topic.");
                valid = false;
            } else {
                clearErr(wWorkshopSelect, "wWorkshopError");
            }

            const sessionCount = parseInt(wSessions.value, 10);
            if (isNaN(sessionCount) || sessionCount < 1) {
                showErr(wSessions, "wSessionsError", "Please enter at least 1 session.");
                valid = false;
            } else {
                clearErr(wSessions, "wSessionsError");
            }

            if (valid) {
                const bookingRef = "WKSP-" + Math.floor(100000 + Math.random() * 900000);
                wBookingSummary.innerHTML = `
                    <h4>✓ Workshop Seat Confirmed!</h4>
                    <p><strong>Booking Ref:</strong> ${bookingRef}</p>
                    <p><strong>Student:</strong> ${escapeHtml(wFullName.value.trim())} (${escapeHtml(wStudentId.value.trim())})</p>
                    <p><strong>Workshop:</strong> ${wWorkshopSelect.value}</p>
                    <p><strong>Sessions:</strong> ${sessionCount}</p>
                `;
                wBookingSummary.classList.remove("hidden");
                workshopForm.reset();
                wSessions.value = "1";
            }
        });
    }

    function escapeHtml(text) {
        const div = document.createElement("div");
        div.textContent = text;
        return div.innerHTML;
    }
});
