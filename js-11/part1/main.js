/**
 * Main Controller for Exercise 1
 * Demonstrates ES6 Modules (import/export), setInterval(), and setTimeout()
 */

import { startCountdown, stopCountdown, scheduleAlert } from "./modules/timer.js";
import { getClasses, addClass, deleteClass, getNextUpcomingClass } from "./modules/scheduler.js";
import { renderCountdown, renderClassSchedule, showNotification } from "./modules/ui.js";

document.addEventListener("DOMContentLoaded", () => {
    const countdownContainer = document.getElementById("countdownDisplay");
    const scheduleContainer = document.getElementById("scheduleList");
    const classForm = document.getElementById("addClassForm");
    const nextClassTitle = document.getElementById("nextClassTitle");
    const nextClassMeta = document.getElementById("nextClassMeta");

    // Load initial classes
    let classes = getClasses();

    function updateActiveCountdown() {
        const nextClass = getNextUpcomingClass(classes);

        if (!nextClass) {
            nextClassTitle.textContent = "No Upcoming Classes";
            nextClassMeta.textContent = "Schedule a new class to activate the countdown timer.";
            renderCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true }, countdownContainer);
            stopCountdown();
            return;
        }

        nextClassTitle.textContent = nextClass.subject;
        const d = new Date(nextClass.dateTime);
        nextClassMeta.textContent = `Starts: ${d.toLocaleDateString("en-IN", { weekday: 'short', month: 'short', day: 'numeric' })} at ${d.toLocaleTimeString("en-IN", { hour: '2-digit', minute: '2-digit' })} • ${nextClass.room} • ${nextClass.instructor}`;

        // Real-time updates with setInterval via timer.js
        startCountdown(
            nextClass.dateTime,
            (timeData) => {
                renderCountdown(timeData, countdownContainer);
            },
            () => {
                showNotification(`📢 Reminder: "${nextClass.subject}" is now active!`, "success");
                renderClassSchedule(classes, scheduleContainer, handleDeleteClass);
            }
        );

        // Demonstrate setTimeout by scheduling a reminder 5 seconds after page load as a demo alert
        scheduleAlert(
            `⏰ Scheduled Alert: Class "${nextClass.subject}" starts soon. Ensure you have your notes ready!`,
            4500,
            (msg) => {
                showNotification(msg, "info");
            }
        );
    }

    function handleDeleteClass(id) {
        classes = deleteClass(id);
        renderClassSchedule(classes, scheduleContainer, handleDeleteClass);
        updateActiveCountdown();
        showNotification("Class removed from schedule.", "info");
    }

    // Form submission
    if (classForm) {
        // Set default datetime to today + 2 hours
        const dtInput = document.getElementById("classDateTime");
        if (dtInput) {
            const now = new Date();
            now.setHours(now.getHours() + 2);
            now.setMinutes(0);
            dtInput.value = now.toISOString().slice(0, 16);
        }

        classForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const subject = document.getElementById("classSubject").value.trim();
            const instructor = document.getElementById("classInstructor").value.trim();
            const room = document.getElementById("classRoom").value.trim();
            const dateTime = document.getElementById("classDateTime").value;
            const duration = document.getElementById("classDuration").value;

            if (!subject || !instructor || !dateTime) {
                alert("Please fill in Subject, Instructor, and Date/Time.");
                return;
            }

            const newClass = addClass({
                subject,
                instructor,
                room: room || "Online",
                dateTime,
                durationMinutes: duration
            });

            classes = getClasses();
            renderClassSchedule(classes, scheduleContainer, handleDeleteClass);
            updateActiveCountdown();

            showNotification(`✓ Class "${newClass.subject}" added to schedule!`, "success");
            classForm.reset();

            // Reset datetime input
            if (dtInput) {
                const updatedNow = new Date();
                updatedNow.setHours(updatedNow.getHours() + 2);
                dtInput.value = updatedNow.toISOString().slice(0, 16);
            }
        });
    }

    // Initial render
    renderClassSchedule(classes, scheduleContainer, handleDeleteClass);
    updateActiveCountdown();
});
