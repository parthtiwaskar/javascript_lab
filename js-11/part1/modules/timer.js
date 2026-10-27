/**
 * Timer Module (ES6 Module)
 * Handles real-time countdowns using setInterval() and scheduled alerts using setTimeout()
 */

let countdownIntervalId = null;
let scheduledTimeoutIds = [];

/**
 * Calculates time remaining until target timestamp
 * @param {Date|number} target - The target date/time
 * @returns {Object} { total, days, hours, minutes, seconds, isPast }
 */
export function calculateTimeRemaining(target) {
    const total = new Date(target).getTime() - new Date().getTime();
    if (total <= 0) {
        return { total: 0, days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
    }

    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / (1000 * 60)) % 60);
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
    const days = Math.floor(total / (1000 * 60 * 60 * 24));

    return { total, days, hours, minutes, seconds, isPast: false };
}

/**
 * Starts a real-time countdown timer using setInterval()
 * @param {Date|number} targetDate - The target date
 * @param {Function} onTick - Callback executed every second with time data
 * @param {Function} onComplete - Callback executed when countdown reaches 0
 */
export function startCountdown(targetDate, onTick, onComplete) {
    if (countdownIntervalId) {
        clearInterval(countdownIntervalId);
    }

    // Immediate first tick
    const initialTime = calculateTimeRemaining(targetDate);
    onTick(initialTime);

    if (initialTime.isPast) {
        if (onComplete) onComplete();
        return;
    }

    // Real-time 1-second interval update
    countdownIntervalId = setInterval(() => {
        const time = calculateTimeRemaining(targetDate);
        onTick(time);

        if (time.isPast) {
            clearInterval(countdownIntervalId);
            countdownIntervalId = null;
            if (onComplete) onComplete();
        }
    }, 1000);
}

/**
 * Stops the active countdown timer
 */
export function stopCountdown() {
    if (countdownIntervalId) {
        clearInterval(countdownIntervalId);
        countdownIntervalId = null;
    }
}

/**
 * Schedules a future alert/notification using setTimeout()
 * @param {string} message - Notification text
 * @param {number} delayMs - Delay in milliseconds
 * @param {Function} callback - Callback function receiving the message
 * @returns {number} The timeout ID
 */
export function scheduleAlert(message, delayMs, callback) {
    const timeoutId = setTimeout(() => {
        if (callback) callback(message);
        // Remove from tracked timeouts
        scheduledTimeoutIds = scheduledTimeoutIds.filter(id => id !== timeoutId);
    }, delayMs);

    scheduledTimeoutIds.push(timeoutId);
    return timeoutId;
}

/**
 * Clears all scheduled timeouts
 */
export function clearAllScheduledAlerts() {
    scheduledTimeoutIds.forEach(id => clearTimeout(id));
    scheduledTimeoutIds = [];
}
