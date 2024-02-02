class ReadathonTimer {
    constructor() {

        this.childsNameEl = document.getElementById('name')
        this.todaysDateEl = document.getElementById('currentDate')
        this.timeEl = document.getElementById('timer')
        this.pastTimersEl = document.getElementById('pastTimers')
        this.startStopButton = document.getElementById('toggleButton');

        // load data from local storage
        this.loadData();
        this.checkDate();

        this.updateDisplay();

        this.startStopButton.addEventListener('click', () => {
            if (this.data.isRunning) {
                this.stop();
            } else {
                this.start();
            }
        })

        this.childsNameEl.addEventListener('click', () => {
            this.promptForName();
        })

        setInterval(() => {
            this.checkDate()
        }, 5000);
    }

    checkDate() {

        if (!this.data.timers.length || this.data.timers[this.data.timers.length - 1]?.date?.getDate() !== new Date().getDate()) {
            this.data.isRunning = false;

            // Save date as YYYY-MM-DD
            this.data.timers.push({ elapsed: 0, date: new Date(new Date().toDateString()) });
            this.saveData();
            this.updateDisplay();
        }
    }

    loadData() {
        this.data = JSON.parse(localStorage.getItem('readathon-timer')) || {
            childsName: '',
            isRunning: false,
            timers: []
        };

        // Parse dates from strings
        this.data.timers.forEach(timer => {
            timer.date = new Date(timer.date);
        });

        this.promptForName()

        // If timer is running, start it
        if (this.data.isRunning) {
            this.start();
        }
    }

    promptForName() {
        if (!this.data.childsName) {
            this.data.childsName = prompt('What is your name?');
            if (this.data.childsName) {
                this.saveData();
            } else {
                this.promptForName();
            }
        }
    }

    saveData() {
        localStorage.setItem('readathon-timer', JSON.stringify(this.data));
    }

    start() {
        this.data.isRunning = true;
        this.saveData();
        this.tick();
        this.tickInterval = setInterval(() => this.tick(), 1000);
        this.updateDisplay
    }

    stop() {
        this.data.isRunning = false;
        clearInterval(this.tickInterval);
        this.saveData();
        this.updateDisplay()
    }

    tick() {
        this.data.timers[this.data.timers.length - 1].elapsed++;
        this.saveData();
        this.updateDisplay();
    }

    updateDisplay() {
        this.childsNameEl.textContent = this.data.childsName;

        // Format today's date as "DayOfWeek, Mon. Date"
        const options = { weekday: 'long', month: 'short', day: 'numeric' };
        const today = new Date().toLocaleDateString('en-US', options);
        this.todaysDateEl.textContent = today;

        this.timeEl.textContent = this.formatTime(this.data.timers[this.data.timers.length - 1].elapsed);

        const pastTimersMinusToday = this.data.timers.slice(0, -1);

        if (pastTimersMinusToday.length) {
            this.pastTimersEl.innerHTML = pastTimersMinusToday.map(timer => {
                const formattedDate = timer.date.toLocaleDateString('en-US', options);
                return `<li>${formattedDate} - ${this.formatTime(timer.elapsed)}</li>`;
            }).join('');
        } else {
            this.pastTimersEl.innerHTML = '';
        }

        this.startStopButton.textContent = this.data.isRunning ? 'Stop' : 'Start';
    }

    formatTime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;

        let formattedTime = '';

        if (hours > 0) {
            formattedTime += `${hours} hours `;
        }

        if (minutes > 0) {
            formattedTime += `${minutes} minutes `;
        }

        formattedTime += `${remainingSeconds} seconds`;

        return formattedTime;
    }
}

new ReadathonTimer();

