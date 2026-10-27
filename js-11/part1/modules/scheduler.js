/**
 * Scheduler Module (ES6 Module)
 * Manages class items, sorting, status checks, and local persistence
 */

const STORAGE_KEY = "p11_class_schedule_data";

const defaultClasses = [
    {
        id: "CLS-101",
        subject: "Web Technologies & JavaScript",
        instructor: "Prof. Sharma",
        room: "Lab 302",
        // Schedule today + 2 hours for immediate demo
        dateTime: new Date(Date.now() + 1000 * 60 * 95).toISOString(),
        durationMinutes: 60
    },
    {
        id: "CLS-102",
        subject: "Database Management Systems",
        instructor: "Dr. Kulkarni",
        room: "Seminar Hall A",
        dateTime: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
        durationMinutes: 90
    },
    {
        id: "CLS-103",
        subject: "Cloud Computing & DevOps",
        instructor: "Prof. Joshi",
        room: "Online - Google Meet",
        dateTime: new Date(Date.now() + 1000 * 60 * 60 * 48).toISOString(),
        durationMinutes: 75
    }
];

/**
 * Loads classes from localStorage or falls back to default schedule
 * @returns {Array} Array of class objects
 */
export function getClasses() {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
        try {
            return JSON.parse(data);
        } catch (e) {
            console.error("Failed to parse stored class schedule", e);
        }
    }
    saveClasses(defaultClasses);
    return [...defaultClasses];
}

/**
 * Saves classes to localStorage
 * @param {Array} classes - Array of class objects
 */
export function saveClasses(classes) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(classes));
}

/**
 * Adds a new class and persists it
 * @param {Object} classData - { subject, instructor, room, dateTime, durationMinutes }
 * @returns {Object} The created class object
 */
export function addClass(classData) {
    const classes = getClasses();
    const newClass = {
        id: "CLS-" + Math.floor(100 + Math.random() * 900),
        subject: classData.subject,
        instructor: classData.instructor,
        room: classData.room || "Room TBA",
        dateTime: classData.dateTime,
        durationMinutes: parseInt(classData.durationMinutes, 10) || 60
    };

    classes.push(newClass);
    saveClasses(classes);
    return newClass;
}

/**
 * Deletes a class by ID
 * @param {string} id - Class identifier
 */
export function deleteClass(id) {
    const classes = getClasses().filter(c => c.id !== id);
    saveClasses(classes);
    return classes;
}

/**
 * Determines current status of a class
 * @param {Object} classItem - Class object
 * @returns {Object} { status: 'upcoming'|'in-progress'|'completed', label: string }
 */
export function getClassStatus(classItem) {
    const now = Date.now();
    const start = new Date(classItem.dateTime).getTime();
    const end = start + (classItem.durationMinutes * 60 * 1000);

    if (now < start) {
        return { status: "upcoming", label: "Upcoming" };
    } else if (now >= start && now <= end) {
        return { status: "in-progress", label: "Live Now" };
    } else {
        return { status: "completed", label: "Completed" };
    }
}

/**
 * Finds the earliest upcoming or in-progress class
 * @param {Array} classes - List of class objects
 * @returns {Object|null}
 */
export function getNextUpcomingClass(classes) {
    const now = Date.now();
    const sorted = [...classes].sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));
    
    // Check for in-progress or upcoming
    for (const c of sorted) {
        const start = new Date(c.dateTime).getTime();
        const end = start + (c.durationMinutes * 60 * 1000);
        if (now <= end) {
            return c;
        }
    }
    return sorted[0] || null;
}
