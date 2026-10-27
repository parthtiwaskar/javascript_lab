const defaultOrders = [
    { id: 1001, customer: "Aarav Sharma", item: "Margherita Pizza", qty: 2, amount: 600, status: "Preparing" },
    { id: 1002, customer: "Priya Patil", item: "Veg Burger", qty: 1, amount: 180, status: "Ready" },
    { id: 1003, customer: "Rohan Mehta", item: "Paneer Biryani", qty: 2, amount: 500, status: "Delivered" },
    { id: 1004, customer: "Sneha Joshi", item: "White Sauce Pasta", qty: 1, amount: 250, status: "Preparing" },
    { id: 1005, customer: "Aditya Kulkarni", item: "Masala Dosa", qty: 2, amount: 240, status: "Delivered" },
    { id: 1006, customer: "Hussain", item: "Pasta", qty: 2, amount: 400, status: "Preparing" },
    { id: 1007, customer: "Tyson", item: "Dosa", qty: 1, amount: 100, status: "Preparing" }
];

class FoodOrderManager {
    constructor() {
        this.orders = this.loadOrders();
        this.form = document.getElementById("orderForm");
        this.customerNameInput = document.getElementById("customerName");
        this.foodItemInput = document.getElementById("foodItem");
        this.quantityInput = document.getElementById("quantity");
        this.totalAmountInput = document.getElementById("totalAmount");
        this.successMsg = document.getElementById("orderSuccessMsg");
        this.tableBody = document.getElementById("ordersTableBody");
        this.totalOrdersCount = document.getElementById("totalOrdersCount");
        this.totalSalesAmount = document.getElementById("totalSalesAmount");
        this.viewOrdersBtn = document.getElementById("viewOrdersBtn");

        this.init();
    }

    loadOrders() {
        const stored = localStorage.getItem("food_orders_data");
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch (e) {
                console.error("Error parsing stored orders", e);
            }
        }
        return [...defaultOrders];
    }

    saveOrders() {
        localStorage.setItem("food_orders_data", JSON.stringify(this.orders));
    }

    init() {
        this.renderTable();
        this.updateStats();

        this.form.addEventListener("submit", (e) => this.handleOrderSubmit(e));

        this.viewOrdersBtn.addEventListener("click", () => {
            this.viewOrdersBtn.style.transform = "rotate(180deg)";
            setTimeout(() => {
                this.viewOrdersBtn.style.transform = "rotate(0deg)";
            }, 300);
            this.renderTable();
            this.updateStats();
        });
    }

    getNextOrderId() {
        if (this.orders.length === 0) return 1001;
        const maxId = Math.max(...this.orders.map(o => parseInt(o.id, 10)));
        return maxId + 1;
    }

    handleOrderSubmit(e) {
        e.preventDefault();

        const customer = this.customerNameInput.value.trim();
        const item = this.foodItemInput.value.trim();
        const qty = parseInt(this.quantityInput.value, 10);
        const amount = parseFloat(this.totalAmountInput.value);

        if (!customer || !item || isNaN(qty) || qty < 1 || isNaN(amount) || amount <= 0) {
            alert("Please fill all fields with valid information.");
            return;
        }

        const newOrder = {
            id: this.getNextOrderId(),
            customer: customer,
            item: item,
            qty: qty,
            amount: amount,
            status: "Preparing"
        };

        this.orders.push(newOrder);
        this.saveOrders();

        this.renderTable();
        this.updateStats();

        this.successMsg.classList.remove("hidden");
        setTimeout(() => {
            this.successMsg.classList.add("hidden");
        }, 4000);

        this.form.reset();
        this.quantityInput.value = "1";
    }

    cycleStatus(orderId) {
        const order = this.orders.find(o => o.id === orderId);
        if (!order) return;

        const nextStatus = {
            "Preparing": "Ready",
            "Ready": "Delivered",
            "Delivered": "Preparing"
        };

        order.status = nextStatus[order.status] || "Preparing";
        this.saveOrders();
        this.renderTable();
    }

    renderTable() {
        this.tableBody.innerHTML = "";

        if (this.orders.length === 0) {
            this.tableBody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center; padding: 24px; color: #94a3b8;">
                        No orders recorded yet. Place a new order using the form on the left.
                    </td>
                </tr>
            `;
            return;
        }

        this.orders.forEach(order => {
            const tr = document.createElement("tr");

            const statusClass = order.status ? order.status.toLowerCase() : "preparing";
            const formattedAmount = "₹" + Number(order.amount).toLocaleString("en-IN");

            tr.innerHTML = `
                <td class="order-id">${order.id}</td>
                <td class="customer-name">${this.escapeHtml(order.customer)}</td>
                <td class="food-item">${this.escapeHtml(order.item)}</td>
                <td class="quantity">${order.qty}</td>
                <td class="total-amount">${formattedAmount}</td>
                <td class="order-status">
                    <span class="status-pill ${statusClass}" title="Click to cycle status" data-id="${order.id}">
                        ${order.status}
                    </span>
                </td>
            `;

            const badge = tr.querySelector(".status-pill");
            badge.addEventListener("click", () => this.cycleStatus(order.id));

            this.tableBody.appendChild(tr);
        });
    }

    updateStats() {
        const count = this.orders.length;
        const totalSales = this.orders.reduce((sum, o) => sum + (Number(o.amount) || 0), 0);

        this.totalOrdersCount.textContent = count;
        this.totalSalesAmount.textContent = "₹" + totalSales.toLocaleString("en-IN");
    }

    escapeHtml(text) {
        const div = document.createElement("div");
        div.textContent = text;
        return div.innerHTML;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    new FoodOrderManager();
});
