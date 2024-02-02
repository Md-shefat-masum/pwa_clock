// main.js

// Create a new Web Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
        let s_worker_r = navigator.serviceWorker.register('./service-worker.js')
            .then(function (registration) {
                console.log('Service Worker registered with scope:', registration.scope);
            }, function (err) {
                console.log('Service Worker registration failed:', err);
            });
    });
}

const worker = new Worker('./watchworker.js');
let time_interval = 20;
worker.onmessage = function (event) {
    let elapsedTime = event.data;
    
    let left_min = parseInt(elapsedTime.split(':')[0]) + 1;
    navigator.setAppBadge(left_min);

    let time_div = document.querySelector('.time_div');
    if (time_div) {
        time_div.innerHTML = elapsedTime;
    }
};

// Function to start the stopwatch
function startStopwatch() {
    worker.postMessage('start');
}

// Function to stop the stopwatch
function stopStopwatch() {
    worker.postMessage('stop');
}
function resetStopwatch() {
    worker.postMessage('reset');
}

// Function to format time
function formatTime(milliseconds) {
    let min = new Date(milliseconds).toTimeString().split(':')[1];
    return parseInt(min);
}

// Function to show notification
function showTimeNotification(title, body) {
    // Check if the browser supports notifications
    if (!('Notification' in window)) {
        console.log('This browser does not support notifications');
        return;
    }
    Notification.requestPermission().then(function (permission) {
        if (permission === 'granted') {
            // Create and show the notification
            const notification = new Notification(title, { body: body });
        }
    });
}