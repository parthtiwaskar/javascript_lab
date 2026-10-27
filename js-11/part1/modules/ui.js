/**
 * UI Rendering Module (ES6 Module)
 * Handles DOM manipulation, card creation, and alert banners
 */

import { getClassStatus } from "./scheduler.js";

/**
 * Updates countdown UI display
 * @param {Object} time - { days, hours, minutes, seconds, isPast }
 * @param {HTMLElement} container - Target container element
 */
export function renderCountdown(time, container) {
    if (!container) return;

    if (time.isPast) {
        container.innerHTML = `
            <div class="countdown-badge live">
                <span class="live-pulse"></span>
                <strong>CLASS IS CURRENTLY ACTIVE / LIVE NOW</strong>
            </div>
        `;
        return;
    }

    const pad = (n) => String(n).padStart(2, "0");

    container.innerHTML = `
        <div class="time-card">
            <span class="time-val">${pad(time.days)}</span>
            <span class="time-unit">Days</span>
        </div>
        <div class="time-sep">:</div>
        <div class="time-card">
            <span class="time-val">${pad(time.hours)}</span>
            <span class="time-unit">Hours</span>
        </div>
        <div class="time-sep">:</div>
        <div class="time-card">
            <span class="time-val">${pad(time.minutes)}</span>
            <span class="time-unit">Minutes</span>
        </div>
        <div class="time-sep">:</div>
        <div class="time-card">
            <span class="time-val accent-val">${pad(time.seconds)}</span>
            <span class="time-unit">Seconds</span>
        </div>
    `;
}

/**
 * Renders the table or list of scheduled classes
 * @param {Array} classes - List of class objects
 * @param {HTMLElement} listContainer - Destination element
 * @param {Function} onDeleteClick - Callback when delete button clicked
 */
export function renderClassSchedule(classes, listContainer, onDeleteClick) {
    if (!listContainer) return;
    listContainer.innerHTML = "";

    if (classes.length === 0) {
        listContainer.innerHTML = `
            <div class="empty-state">
                <p>No classes scheduled yet. Add one using the form on the left.</p>
            </div>
        `;
        return;
    }

    // Sort chronologically
    const sorted = [...classes].sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));

    sorted.forEach(c => {
        const dateObj = new Date(c.dateTime);
        const formattedDate = dateObj.toLocaleDateString("en-IN", {
            weekday: "short",
            month: "short",
            day: "numeric"
        });
        const formattedTime = dateObj.toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit"
        });

        const statusInfo = getClassStatus(c);

        const card = document.createElement("div");
        card.className = `class-item ${statusInfo.status}`;
        card.innerHTML = `
            <div class="class-info">
                <div class="class-time-badge">
                    <span class="badge-date">${formattedDate}</span>
                    <span class="badge-clock">${formattedTime}</span>
                </div>
                <div class="class-details">
                    <div class="class-header-row">
                        <h4 class="class-subject">${escapeHtml(c.subject)}</h4>
                        <span class="status-tag ${statusInfo.status}">${statusInfo.label}</span>
                    </div>
                    <p class="class-subtext">
                        <span>👨‍🏫 ${escapeHtml(c.instructor)}</span> • 
                        <span>📍 ${escapeHtml(c.room)}</span> • 
                        <span>⏱️ ${c.durationMinutes} mins</span>
                    </p>
                </div>
            </div>
            <button class="btn-delete" title="Remove class" data-id="${c.id}">
                🗑️
            </button>
        `;

        const delBtn = card.querySelector(".btn-delete");
        delBtn.addEventListener("click", () => onDeleteClick(c.id));

        listContainer.appendChild(card);
    });
}

/**
 * Displays a timed alert banner on screen
 * @param {string} message - Notification text
 * @param {string} type - 'info' | 'success' | 'warning'
 */
export function showNotification(message, type = "info") {
    let toast = document.getElementById("p11-toast");
    if (!toast) {
        toast = document.createElement("div");
        toast.id = "p11-toast";
        toast.className = "toast-banner";
        document.body.appendChild(toast);
    }

    toast.className = `toast-banner ${type} visible`;
    toast.innerHTML = `
        <span class="toast-icon">${type === "success" ? "✓" : "⏰"}</span>
        <span class="toast-message">${escapeHtml(message)}</span>
    `;

    // Auto dismiss after 4 seconds
    setTimeout(() => {
        toast.classList.remove("visible");
    }, 4000);
}

function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}
