let countdown;
let timerRunning = false;
let time_interval = 10;
const initialTime = time_interval * 60; // 20 minutes in seconds
let currentTime = initialTime;

function updateTime() {
    currentTime--;
    const minutes = Math.floor(currentTime / 60);
    const seconds = currentTime % 60;
    const displayTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    postMessage(displayTime);

    if (currentTime <= 0) {
        resetTimer();
    }
}

function startTimer() {
    clearInterval(countdown);
    if (!timerRunning) {
        timerRunning = true;
        countdown = setInterval(() => {
            if (timerRunning)
                updateTime();
        }, 1000);
    }
}

function resetTimer() {
    clearInterval(countdown);
    currentTime = initialTime;
    timerRunning = false;
    startTimer();
}

// Listen for messages from the main script
onmessage = function (event) {
    const command = event.data;
    if (command === 'start') {
        startTimer();
    } else if (command === 'stop') {
        timerRunning = !timerRunning;
    }
    else if (command === 'reset') {
        resetTimer();
    }
};
