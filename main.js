// main.js
let startStopwatch = () => '';
let stopStopwatch = () => '';
let resetStopwatch = () => '';

// Create a new Web Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', async function () {
        let s_worker_r = await navigator.serviceWorker.register('./service-worker.js');

        await navigator.serviceWorker.ready.then((registration) => {
            startStopwatch = () => {
                registration.active.postMessage({ command: 'start', msg: '' });
            }
            // Function to stop the stopwatch
            stopStopwatch = () => {
                registration.active.postMessage({ command: 'stop', msg: '' });
            }
            resetStopwatch = () => {
                registration.active.postMessage({ command: 'reset', msg: '' });
            }
        });
    });
}

navigator.serviceWorker.onmessage = function (event) {
    // console.log('Message from service worker:', event);

    if (event.data.command == 'print') {
        let elapsedTime = event.data.msg;

        let left_min = parseInt(elapsedTime.split(':')[0]) + 1;
        let left_sec = parseInt(elapsedTime.split(':')[1]);
        if (navigator.setAppBadge)
            navigator.setAppBadge(left_min);

        if (left_min == 1 && left_sec <= 7) {
            document.getElementById('sound').play();
            showTimeNotification("Interval just finished", '')
        }

        let time_div = document.querySelector('.time_div');
        if (time_div) {
            time_div.innerHTML = elapsedTime;
            document.title = elapsedTime;
        }
    }
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