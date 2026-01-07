// worker-pool.js
const { Worker } = require('worker_threads');
const path = require('path');

class WorkerPool {
  constructor(size) {
    this.size = size;
    this.workers = [];
    this.idleWorkers = [];
    this.queue = [];

    for (let i = 0; i < size; i++) {
      this.createWorker();
    }
  }

  createWorker() {
    const worker = new Worker(path.resolve(__dirname, 'file-worker.js'));

    worker.on('message', msg => {
      worker.currentJob.resolve(msg);
      worker.currentJob = null;
      this.idleWorkers.push(worker);
      this.runNext();
    });

    worker.on('error', err => {
      console.error('Worker error', err);
    });

    this.idleWorkers.push(worker);
    this.workers.push(worker);
  }

  run(job) {
    return new Promise(resolve => {
      this.queue.push({ job, resolve });
      this.runNext();
    });
  }

  runNext() {
    if (this.queue.length === 0) return;
    if (this.idleWorkers.length === 0) return;

    const worker = this.idleWorkers.pop();
    const { job, resolve } = this.queue.shift();

    worker.currentJob = { resolve };
    worker.postMessage(job);
  }
}

module.exports = WorkerPool;
