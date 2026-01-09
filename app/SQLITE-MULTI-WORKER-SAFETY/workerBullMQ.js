const { Worker } = require('bullmq');
const WorkerPool = require('../scripts/concurrency');
const dbWriter = require('./db-writer');
const path = require('path');

const pool = new WorkerPool(2);

(async () => {
  await dbWriter.init();

  new Worker(
    'files',
    async job => {
      const absolutePath = path.join(process.cwd(), 'data', path.basename(job.data.filePath));

      console.log('Processing:', absolutePath);

      const result = await pool.run({
        jobId: job.id,
        filePath: absolutePath
      });

      console.log('Worker result:', result);

      dbWriter.push({
        filePath: absolutePath,
        lines: result.result.lines,
        processedAt: new Date().toISOString()
      });

      return result;
    },
    {
      connection: {
        host: '127.0.0.1',
        port: 6379
      },
      concurrency: 1
    }
  );
})();
