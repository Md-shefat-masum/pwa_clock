// service-worker.js
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

    self.clients.matchAll().then(all => all.forEach(client => {
        client.postMessage({
            command: 'print',
            msg: displayTime
        });
    }));

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
    const command = event.data.command;
    if (command === 'start') {
        startTimer();
    } else if (command === 'stop') {
        timerRunning = !timerRunning;
    }
    else if (command === 'reset') {
        resetTimer();
    }
};

// Install event
self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open('your-app-cache').then(function (cache) {
            return cache.addAll([
                // Add paths to your static assets (HTML, CSS, JS, images, etc.)
                './index.html',
                './styles.css',
                './main.js',
                './service-worker.js',
                './watchworker.js',
                './notify.wav',
                './16.ico',
                './192.png',
                './512.png',
                // Add more paths as needed
            ]);
        })
    );
});

// Fetch event
self.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.match(event.request).then(function (response) {
            return response || fetch(event.request);
        })
    );
});

self.addEventListener('push', function (event) {
    const options = {
        badge: 'https://shefat.info/assets/icons/icon-512x512.png',
        data: {
            badgeCount: 334
            // Update the badge count from the incoming notification data
        }
    };
    event.waitUntil(
        self.registration.showNotification('New Notification', options)
    );
    self.registration.showNotification("Hello from the Service Worker!");
});

self.addEventListener('activate', event => {
    event.waitUntil(
        self.clients.claim()
    );
});