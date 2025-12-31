// scripts/worker.js
const { parentPort } = require('worker_threads');

function heavyCompute(limit) {
  let sum = 0;
  for (let i = 0; i < limit; i++) {
    sum += i;
  }
  return sum;
}

parentPort.on('message', (data) => {
  const limit = data.limit || 1e8;
  const result = heavyCompute(limit);
  parentPort.postMessage(result);
});