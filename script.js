let running = false;
let elapsedSeconds = 0;
let interval;

// Update Timer Display Function
function updateTimerDisplay(elapsedSec) {
    const hours = Math.floor(elapsedSec / 3600);
    const minutes = Math.floor((elapsedSec % 3600) / 60);
    const seconds = elapsedSec % 60;
    const timerDisplay = document.getElementById('timer');

    let displayText = '';
    if (hours > 0) {
        displayText += `${hours} hour${hours > 1 ? 's' : ''} `;
    }
    if (minutes > 0 || hours > 0) { // Display minutes if there are hours
        displayText += `${minutes} minute${minutes > 1 ? 's' : ''} `;
    }
    displayText += `${seconds} second${seconds > 1 ? 's' : ''}`;

    timerDisplay.textContent = displayText;
}


// Start Timer Function
function startTimer() {
    running = true;
    interval = setInterval(() => {
        elapsedSeconds++;
        updateTimerDisplay(elapsedSeconds);
        saveData();
    }, 1000);
}

// Stop Timer Function
function stopTimer() {
    clearInterval(interval);
    running = false;
    saveData();
}

// Save Data Function
function saveData() {
    const currentDateDisplay = document.getElementById('currentDate');
    localStorage.setItem('readingTimerData', JSON.stringify({ elapsedSeconds, currentDate: currentDateDisplay.textContent, running }));
}

document.addEventListener('DOMContentLoaded', () => {
    const toggleButton = document.getElementById('toggleButton');
    const currentDateDisplay = document.getElementById('currentDate');

    // Initialize from local storage
    const loadData = () => {
        const storedData = JSON.parse(localStorage.getItem('readingTimerData'));
        if (storedData) {
            elapsedSeconds = storedData.elapsedSeconds;
            currentDateDisplay.textContent = storedData.currentDate;
            running = storedData.running;
            updateTimerDisplay(elapsedSeconds);
            if (running) {
                startTimer();
                toggleButton.textContent = 'Stop';
            }
        } else {
            // Set to today's date and 0 for the time elapsed
            currentDateDisplay.textContent = "Tuesday, Jan 30th";
            localStorage.setItem('readingTimerData', JSON.stringify({ elapsedSeconds, currentDate: "Tuesday, Jan 30th", running }));
        }
    };

    loadData();

    toggleButton.addEventListener('click', () => {
        if (running) {
            stopTimer();
            toggleButton.textContent = 'Start';
        } else {
            startTimer();
            toggleButton.textContent = 'Stop';
        }
    });
});
