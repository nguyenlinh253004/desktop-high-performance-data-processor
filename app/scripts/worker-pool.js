// scripts/worker-pool.js
const { Worker } = require('worker_threads');
const path = require('path');

class WorkerPool {
  constructor(size, workerPath) {
    this.size = size;
    this.workerPath =  workerPath // dùng đường dẫn tuyệt đối cho chắc
    this.workers = [];
    this.idleWorkers = []; // stack các worker đang rảnh
    this.queue = [];

    for (let i = 0; i < size; i++) {
      this.createWorker();
    }
  }

  createWorker() {
    const worker = new Worker(this.workerPath);

    // Khi worker gửi message về (kết quả)
    worker.on('message', (result) => {
      // Lấy resolve tương ứng với task đang chạy trên worker này
      const resolve = worker.pendingResolve;
      if (resolve) {
        resolve(result);
        worker.pendingResolve = null;
      }

      // Worker giờ rảnh rồi, cho vào hàng đợi idle và chạy task tiếp nếu có
      this.idleWorkers.push(worker);
      this.runNext();
    });

    worker.on('error', (err) => {
      console.error('Worker error:', err);
      // Có thể xử lý reject nếu cần
    });

    worker.on('exit', (code) => {
      if (code !== 0) {
        console.error(`Worker stopped with exit code ${code}`);
      }
      // Xóa worker chết khỏi danh sách nếu cần
      this.workers = this.workers.filter(w => w !== worker);
      this.idleWorkers = this.idleWorkers.filter(w => w !== worker);
    });

    this.workers.push(worker);
    this.idleWorkers.push(worker); // ban đầu đều rảnh
  }

  runTask(data) {
    return new Promise((resolve) => {
      this.queue.push({ data, resolve });
      this.runNext();
    });
  }

  runNext() {
    if (this.queue.length === 0 || this.idleWorkers.length === 0) return;

    const worker = this.idleWorkers.pop();
    const task = this.queue.shift();

    // Gắn resolve vào worker để khi nhận message thì gọi
    worker.pendingResolve = task.resolve;

    // Gửi data cho worker
    worker.postMessage(task.data);
  }

  // Optional: terminate all workers
  async terminate() {
    await Promise.all(this.workers.map(w => w.terminate()));
  }
}

module.exports = WorkerPool;