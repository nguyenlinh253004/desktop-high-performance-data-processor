const { Worker } = require('worker_threads');

console.time('worker');

const worker = new Worker('./scripts/worker.js',{
  workerData: { limit: 1e9 }
});

worker.on('message', console.log);

worker.on('error', console.error);

