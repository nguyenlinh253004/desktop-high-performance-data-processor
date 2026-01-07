const { Worker } = require('bullmq');
const WorkerPool = require('./concurrency');

const pool = new WorkerPool(3);

new Worker(
  'files',
  async job => {
    const result = await pool.run({
      jobId: job.id,
      filePath: job.data.filePath
    });

    return result; // ✅ BullMQ tự moveToCompleted
  },
  {
    connection: {
      host: '127.0.0.1',
      port: 6379
    },
    concurrency: 1 // 🔥 QUAN TRỌNG: lock an toàn
  }
);
