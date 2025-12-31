const { parentPort } = require('worker_threads');

parentPort.on('message', (chunk) => {
  const lines = chunk.toString().split('\n');
  let count = 0;

  for (const line of lines) {
    if (line) count++;
  }

  parentPort.postMessage({ processed: count });
});
