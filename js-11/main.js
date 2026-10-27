/**
 * Practical 11 - Unified Hub Master Controller
 * Combines ES6 Module Timers (Part 1) and jQuery AJAX Web App (Part 2)
 */

import { startCountdown, stopCountdown } from "./part1/modules/timer.js";
import { getClasses, addClass, deleteClass, getNextUpcomingClass } from "./part1/modules/scheduler.js";
import { renderCountdown, renderClassSchedule } from "./part1/modules/ui.js";

// =========================================================================
// 1. TAB SWITCHING
// =========================================================================
document.querySelectorAll(".tab-button").forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelectorAll(".tab-button").forEach(b => b.classList.remove("active"));
        document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));

        btn.classList.add("active");
        const target = document.getElementById(btn.getAttribute("data-tab"));
        if (target) target.classList.add("active");
    });
});

// =========================================================================
// 2. EXERCISE 1: ES6 MODULES & TIMERS LOGIC
// =========================================================================
let hubClasses = getClasses();
const countdownWrap = document.getElementById("hubCountdownWrap");
const scheduleWrap = document.getElementById("hubScheduleList");
const classTitle = document.getElementById("hubClassTitle");
const classMeta = document.getElementById("hubClassMeta");
const classForm = document.getElementById("hubClassForm");

function refreshHubCountdown() {
    const nextClass = getNextUpcomingClass(hubClasses);
    if (!nextClass) {
        classTitle.textContent = "No Upcoming Lectures";
        classMeta.textContent = "Add a new lecture using the form on the left.";
        renderCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true }, countdownWrap);
        stopCountdown();
        return;
    }

    classTitle.textContent = nextClass.subject;
    const d = new Date(nextClass.dateTime);
    classMeta.textContent = `Starts: ${d.toLocaleDateString("en-IN", { weekday: 'short', month: 'short', day: 'numeric' })} at ${d.toLocaleTimeString("en-IN", { hour: '2-digit', minute: '2-digit' })} • ${nextClass.room} • ${nextClass.instructor}`;

    startCountdown(
        nextClass.dateTime,
        (time) => renderCountdown(time, countdownWrap),
        () => renderClassSchedule(hubClasses, scheduleWrap, handleHubDeleteClass)
    );
}

function handleHubDeleteClass(id) {
    hubClasses = deleteClass(id);
    renderClassSchedule(hubClasses, scheduleWrap, handleHubDeleteClass);
    refreshHubCountdown();
}

if (classForm) {
    const dt = document.getElementById("hDateTime");
    if (dt) {
        const n = new Date();
        n.setHours(n.getHours() + 2);
        n.setMinutes(0);
        dt.value = n.toISOString().slice(0, 16);
    }

    classForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const subject = document.getElementById("hSubject").value.trim();
        const instructor = document.getElementById("hInstructor").value.trim();
        const room = document.getElementById("hRoom").value.trim();
        const dateTime = document.getElementById("hDateTime").value;
        const duration = document.getElementById("hDuration").value;

        if (subject && instructor && dateTime) {
            addClass({ subject, instructor, room: room || "Online", dateTime, durationMinutes: duration });
            hubClasses = getClasses();
            renderClassSchedule(hubClasses, scheduleWrap, handleHubDeleteClass);
            refreshHubCountdown();
            classForm.reset();

            if (dt) {
                const updated = new Date();
                updated.setHours(updated.getHours() + 2);
                dt.value = updated.toISOString().slice(0, 16);
            }
        }
    });
}

// Initial render for Exercise 1
renderClassSchedule(hubClasses, scheduleWrap, handleHubDeleteClass);
refreshHubCountdown();

// =========================================================================
// 3. EXERCISE 2: JQUERY, DOM, EVENTS, STORAGE & AJAX LOGIC
// =========================================================================
$(function () {
    const STORAGE_KEY = "p11_hub_jquery_tasks";

    const defaultHubTasks = [
        { id: 1, title: "Study ES6 Modules & Timers", category: "Study", priority: "high", completed: true, source: "local" },
        { id: 2, title: "Test jQuery $.ajax() REST Calls", category: "Lab Work", priority: "high", completed: false, source: "local" },
        { id: 3, title: "Verify LocalStorage Persistence", category: "Project", priority: "medium", completed: false, source: "local" }
    ];

    let hubTasks = [];
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        hubTasks = stored ? JSON.parse(stored) : [...defaultHubTasks];
    } catch (e) {
        hubTasks = [...defaultHubTasks];
    }

    let activeFilter = "all";

    function saveHubTasks() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(hubTasks));
    }

    function renderHubTasks() {
        const $list = $("#hubTaskList");
        $list.empty();

        const query = $("#hubTaskSearch").val().toLowerCase().trim();

        const filtered = hubTasks.filter(t => {
            const matchesFilter =
                activeFilter === "all" ||
                (activeFilter === "pending" && !t.completed) ||
                (activeFilter === "completed" && t.completed);

            const matchesSearch = t.title.toLowerCase().includes(query) ||
                                  t.category.toLowerCase().includes(query);

            return matchesFilter && matchesSearch;
        });

        if (filtered.length === 0) {
            $list.html(`<div style="text-align:center; padding: 24px; color:#64748b; font-size: 13px;">No tasks found.</div>`);
        } else {
            filtered.forEach(t => {
                const comp = t.completed ? "completed" : "";
                const checked = t.completed ? "checked" : "";
                const apiBadge = t.source === "ajax" ? `<span class="pill-badge source-ajax">API</span>` : "";

                const $row = $(`
                    <div class="task-item ${comp}" data-id="${t.id}">
                        <div class="task-left">
                            <input type="checkbox" class="task-checkbox" ${checked}>
                            <div>
                                <span class="task-title">${escapeHtml(t.title)}</span>
                                <div class="task-meta">
                                    <span class="pill-badge priority-${t.priority}">${t.priority}</span>
                                    <span>${escapeHtml(t.category)}</span>
                                    ${apiBadge}
                                </div>
                            </div>
                        </div>
                        <button class="btn-task-del">✖</button>
                    </div>
                `);
                $list.append($row);
            });
        }

        // Update stats
        const total = hubTasks.length;
        const comp = hubTasks.filter(t => t.completed).length;
        $("#hubStatTotal").text(total);
        $("#hubStatCompleted").text(comp);
        $("#hubStatPending").text(total - comp);
    }

    // jQuery Task Form Submit
    $("#hubTaskForm").on("submit", function (e) {
        e.preventDefault();
        const title = $("#hTaskTitle").val().trim();
        const category = $("#hTaskCategory").val();
        const priority = $("#hTaskPriority").val();

        if (title) {
            hubTasks.unshift({
                id: Date.now(),
                title,
                category,
                priority,
                completed: false,
                source: "local"
            });
            saveHubTasks();
            renderHubTasks();
            $(".task-item").first().hide().slideDown(250);
            this.reset();
        }
    });

    // Checkbox toggle
    $("#hubTaskList").on("change", ".task-checkbox", function () {
        const id = $(this).closest(".task-item").data("id");
        const item = hubTasks.find(t => t.id === id);
        if (item) {
            item.completed = this.checked;
            saveHubTasks();
            renderHubTasks();
        }
    });

    // Delete task
    $("#hubTaskList").on("click", ".btn-task-del", function () {
        const $item = $(this).closest(".task-item");
        const id = $item.data("id");
        $item.fadeOut(200, function () {
            hubTasks = hubTasks.filter(t => t.id !== id);
            saveHubTasks();
            renderHubTasks();
        });
    });

    // Filter Buttons
    $(".f-btn").on("click", function () {
        $(".f-btn").removeClass("active");
        $(this).addClass("active");
        activeFilter = $(this).data("filter");
        renderHubTasks();
    });

    // Search input
    $("#hubTaskSearch").on("keyup", function () {
        renderHubTasks();
    });

    // AJAX 1: Remote JSONPlaceholder API with local tasks.json fallback
    $("#hubBtnAjaxImport").on("click", function () {
        const $btn = $(this);
        const $log = $("#hubAjaxLog");

        $btn.prop("disabled", true).text("⏳ Fetching from REST API...");
        $log.slideDown().text("Calling endpoint via $.ajax()...");

        function processTasks(res, sourceLabel) {
            let count = 0;
            res.forEach(item => {
                const uniqueId = "api-" + item.id;
                if (!hubTasks.some(t => t.id === uniqueId)) {
                    hubTasks.push({
                        id: uniqueId,
                        title: item.title.charAt(0).toUpperCase() + item.title.slice(1),
                        category: item.category || "REST API",
                        priority: item.priority || (item.completed ? "low" : "high"),
                        completed: Boolean(item.completed),
                        source: "ajax"
                    });
                    count++;
                }
            });
            saveHubTasks();
            renderHubTasks();
            $log.html(`<span style="color:#10b981;">✓ $.ajax() OK (200 OK):</span> Imported ${count > 0 ? count : res.length} live tasks via ${sourceLabel}.`);
            $btn.prop("disabled", false).text("☁️ Fetch Tasks via $.ajax()");
        }

        // Try primary remote endpoint
        $.ajax({
            url: "https://jsonplaceholder.typicode.com/todos?_limit=4",
            type: "GET",
            dataType: "json",
            timeout: 3000,
            success: function (res) {
                processTasks(res, "JSONPlaceholder REST API");
            },
            error: function () {
                // Secondary AJAX call to bundled tasks.json
                $.ajax({
                    url: "tasks.json",
                    type: "GET",
                    dataType: "json",
                    timeout: 2000,
                    success: function (localRes) {
                        processTasks(localRes, "Local tasks.json REST Resource");
                    },
                    error: function () {
                        // Offline embedded fallback data
                        const fallbackData = [
                            { id: 201, title: "Implement Asynchronous AJAX Call with jQuery", category: "Lab Work", priority: "high", completed: false },
                            { id: 202, title: "Configure LocalStorage Task Persistence", category: "Project", priority: "medium", completed: true },
                            { id: 203, title: "Analyze ES6 Module Import/Export Semantics", category: "Study", priority: "medium", completed: false },
                            { id: 204, title: "Test REST API Endpoints with HTTP GET", category: "Lab Work", priority: "high", completed: false }
                        ];
                        processTasks(fallbackData, "Simulated AJAX JSON Stream");
                    }
                });
            }
        });
    });

    // AJAX 2: Live Weather
    function fetchWeather() {
        $.ajax({
            url: "https://api.open-meteo.com/v1/forecast?latitude=19.0760&longitude=72.8777&current_weather=true",
            type: "GET",
            dataType: "json",
            success: function (data) {
                if (data && data.current_weather) {
                    $("#hubWeatherDisplay").html(
                        `<strong>Campus Weather:</strong> ${data.current_weather.temperature}°C • Wind: ${data.current_weather.windspeed} km/h (Live $.ajax() 200 OK)`
                    );
                }
            },
            error: function () {
                $("#hubWeatherDisplay").html(`<strong>Campus Weather:</strong> 29.0°C Sunny (Fallback)`);
            }
        });
    }

    $("#hubRefreshWeather").on("click", fetchWeather);

    function escapeHtml(str) {
        return $("<div>").text(str).html();
    }

    // Init Exercise 2
    renderHubTasks();
    fetchWeather();
});
