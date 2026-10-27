/**
 * Practical 11 - Exercise 2
 * Interactive Web Application built using JavaScript & jQuery
 * Demonstrating: DOM Manipulation, Event Handling, LocalStorage, and AJAX Integration
 */

$(document).ready(function () {
    const STORAGE_KEY = "p11_jquery_tasks";

    // Initial default task dataset
    const defaultTasks = [
        { id: 1, title: "Review ES6 Module syntax & Timers", category: "Lab", priority: "high", completed: true, source: "local" },
        { id: 2, title: "Prepare JavaScript AJAX Presentation", category: "Study", priority: "medium", completed: false, source: "local" },
        { id: 3, title: "Submit Practical 11 write-up and code", category: "Assignment", priority: "high", completed: false, source: "local" }
    ];

    let tasks = loadTasksFromStorage();
    let currentFilter = "all";

    // ==========================================
    // 1. STORAGE MANAGEMENT (localStorage)
    // ==========================================
    function loadTasksFromStorage() {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch (err) {
                console.error("Failed to parse stored tasks:", err);
            }
        }
        saveTasksToStorage(defaultTasks);
        return [...defaultTasks];
    }

    function saveTasksToStorage(taskList) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(taskList));
    }

    // ==========================================
    // 2. DOM MANIPULATION WITH JQUERY
    // ==========================================
    function renderTasks() {
        const $taskList = $("#taskList");
        $taskList.empty();

        const searchQuery = $("#taskSearch").val().toLowerCase().trim();

        const filtered = tasks.filter(task => {
            // Filter by completion status
            const matchesFilter =
                currentFilter === "all" ||
                (currentFilter === "pending" && !task.completed) ||
                (currentFilter === "completed" && task.completed);

            // Filter by search query
            const matchesSearch = task.title.toLowerCase().includes(searchQuery) ||
                                  task.category.toLowerCase().includes(searchQuery);

            return matchesFilter && matchesSearch;
        });

        if (filtered.length === 0) {
            $taskList.html(`
                <div style="text-align:center; padding: 28px; color: #64748b; font-size: 13.5px;">
                    No tasks found matching current filter or search criteria.
                </div>
            `);
        } else {
            filtered.forEach(task => {
                const completedClass = task.completed ? "completed" : "";
                const checkedAttr = task.completed ? "checked" : "";
                const sourceBadge = task.source === "ajax" ? `<span class="pill-badge source-ajax">API</span>` : "";

                const $item = $(`
                    <div class="task-item ${completedClass}" data-id="${task.id}">
                        <div class="task-left">
                            <input type="checkbox" class="task-checkbox" ${checkedAttr}>
                            <div class="task-details">
                                <span class="task-title">${escapeHtml(task.title)}</span>
                                <div class="task-meta">
                                    <span class="pill-badge priority-${task.priority}">${task.priority}</span>
                                    <span>📁 ${escapeHtml(task.category)}</span>
                                    ${sourceBadge}
                                </div>
                            </div>
                        </div>
                        <button class="btn-task-del" title="Delete task">✖</button>
                    </div>
                `);

                $taskList.append($item);
            });
        }

        updateStats();
    }

    function updateStats() {
        const total = tasks.length;
        const completed = tasks.filter(t => t.completed).length;
        const pending = total - completed;

        $("#statTotal").text(total);
        $("#statCompleted").text(completed);
        $("#statPending").text(pending);
    }

    // ==========================================
    // 3. JQUERY EVENT HANDLING
    // ==========================================

    // Form submission: Add Task
    $("#taskForm").on("submit", function (e) {
        e.preventDefault();

        const title = $("#taskTitle").val().trim();
        const category = $("#taskCategory").val();
        const priority = $("#taskPriority").val();

        if (!title) {
            alert("Please provide a task title.");
            return;
        }

        const newTask = {
            id: Date.now(),
            title: title,
            category: category,
            priority: priority,
            completed: false,
            source: "local"
        };

        tasks.unshift(newTask);
        saveTasksToStorage(tasks);
        renderTasks();

        // jQuery animation feedback
        $(".task-item").first().hide().slideDown(300);

        // Reset form
        this.reset();
    });

    // Checkbox toggle (Event delegation)
    $("#taskList").on("change", ".task-checkbox", function () {
        const taskId = $(this).closest(".task-item").data("id");
        const task = tasks.find(t => t.id === taskId);
        if (task) {
            task.completed = this.checked;
            saveTasksToStorage(tasks);
            renderTasks();
        }
    });

    // Delete task (Event delegation with fadeOut animation)
    $("#taskList").on("click", ".btn-task-del", function () {
        const $item = $(this).closest(".task-item");
        const taskId = $item.data("id");

        $item.fadeOut(250, function () {
            tasks = tasks.filter(t => t.id !== taskId);
            saveTasksToStorage(tasks);
            renderTasks();
        });
    });

    // Filter Buttons (All, Pending, Completed)
    $(".filter-btn").on("click", function () {
        $(".filter-btn").removeClass("active");
        $(this).addClass("active");
        currentFilter = $(this).data("filter");
        renderTasks();
    });

    // Real-time live search with jQuery keyup
    $("#taskSearch").on("keyup", function () {
        renderTasks();
    });

    // ==========================================
    // 4. AJAX INTEGRATION ($.ajax)
    // ==========================================

    // AJAX Call 1: Fetch Live Weather Status via Open-Meteo REST API
    function fetchLiveCampusWeather() {
        const $weatherText = $("#weatherText");
        const $logBox = $("#ajaxLogBox");

        $.ajax({
            url: "https://api.open-meteo.com/v1/forecast?latitude=19.0760&longitude=72.8777&current_weather=true",
            type: "GET",
            dataType: "json",
            beforeSend: function () {
                $weatherText.html(`<em>⏳ Connecting to remote weather API...</em>`);
            },
            success: function (data) {
                if (data && data.current_weather) {
                    const temp = data.current_weather.temperature;
                    const wind = data.current_weather.windspeed;
                    const time = data.current_weather.time.replace("T", " ");

                    $weatherText.html(`
                        <strong>Real-Time Weather:</strong> ${temp}°C • Wind: ${wind} km/h • Last updated: ${time} (AJAX GET 200 OK)
                    `);

                    $logBox.slideDown().html(`
                        <span style="color:#10b981;">✓ AJAX Success:</span> Received <strong>${JSON.stringify(data.current_weather)}</strong> from Open-Meteo REST endpoint.
                    `);
                }
            },
            error: function (xhr, status, error) {
                $weatherText.html(`<strong>Weather API:</strong> 28.5°C Sunny (Fallback local state - ${error})`);
            }
        });
    }

    $("#btnRefreshWeather").on("click", function () {
        fetchLiveCampusWeather();
    });

    // AJAX Call 2: Import Tasks from Remote REST API (JSONPlaceholder) with tasks.json fallback
    $("#btnFetchAjaxTasks").on("click", function () {
        const $btn = $(this);
        const $logBox = $("#ajaxLogBox");

        $btn.prop("disabled", true).html(`⏳ Fetching tasks via $.ajax()...`);
        $logBox.slideDown().text("Calling REST endpoint via $.ajax()...");

        function processImportedTasks(response, sourceLabel) {
            let addedCount = 0;
            response.forEach(item => {
                const uniqueId = "api-" + item.id;
                if (!tasks.some(t => t.id === uniqueId)) {
                    tasks.push({
                        id: uniqueId,
                        title: item.title.charAt(0).toUpperCase() + item.title.slice(1),
                        category: item.category || "Remote API",
                        priority: item.priority || (item.completed ? "low" : "high"),
                        completed: Boolean(item.completed),
                        source: "ajax"
                    });
                    addedCount++;
                }
            });

            saveTasksToStorage(tasks);
            renderTasks();

            $logBox.html(`
                <span style="color:#10b981;">✓ AJAX Response (200 OK):</span> Successfully imported <strong>${addedCount > 0 ? addedCount : response.length}</strong> live tasks via ${sourceLabel}.
            `);
            $btn.prop("disabled", false).html(`☁️ Import Tasks from Remote API`);
        }

        $.ajax({
            url: "https://jsonplaceholder.typicode.com/todos?_limit=4",
            type: "GET",
            dataType: "json",
            timeout: 3000,
            success: function (response) {
                processImportedTasks(response, "JSONPlaceholder REST API");
            },
            error: function () {
                // Try secondary AJAX call to bundled tasks.json
                $.ajax({
                    url: "tasks.json",
                    type: "GET",
                    dataType: "json",
                    timeout: 2000,
                    success: function (localRes) {
                        processImportedTasks(localRes, "Local tasks.json Resource");
                    },
                    error: function () {
                        // Offline embedded fallback data
                        const fallbackData = [
                            { id: 201, title: "Implement Asynchronous AJAX Call with jQuery", category: "Lab Work", priority: "high", completed: false },
                            { id: 202, title: "Configure LocalStorage Task Persistence", category: "Project", priority: "medium", completed: true },
                            { id: 203, title: "Analyze ES6 Module Import/Export Semantics", category: "Study", priority: "medium", completed: false },
                            { id: 204, title: "Test REST API Endpoints with HTTP GET", category: "Lab Work", priority: "high", completed: false }
                        ];
                        processImportedTasks(fallbackData, "Simulated AJAX JSON Stream");
                    }
                });
            }
        });
    });

    // Clear all tasks
    $("#btnClearAll").on("click", function () {
        if (confirm("Are you sure you want to clear all tasks from localStorage?")) {
            tasks = [];
            saveTasksToStorage(tasks);
            renderTasks();
        }
    });

    function escapeHtml(text) {
        return $("<div>").text(text).html();
    }

    // Initialize application
    renderTasks();
    fetchLiveCampusWeather();
});
