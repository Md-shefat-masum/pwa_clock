// Define a variable to hold the interval ID
var intervalId;

// Define a function to handle messages from the main thread
self.onmessage = function(event) {
  if (event.data === 'start') {
    // Start the interval
    intervalId = setInterval(function() {
      // Post a message back to the main thread with the current time
      self.postMessage('Current time: ' + new Date());
    }, 1000); // Interval of 1 second
  }
};

// Define a function to handle termination of the worker
self.onclose = function() {
  // Clear the interval if the worker is terminated
  clearInterval(intervalId);
};
