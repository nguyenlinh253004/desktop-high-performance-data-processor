const WorkerPool = require('./worker-pool');

const pool = new WorkerPool(4, './scripts/worker.js');

(async () => {
  const results = await Promise.all([
    pool.runTask({ limit: 1e8 }),
    pool.runTask({ limit: 1e8 }),
    pool.runTask({ limit: 1e8 }),
  ]);

  console.log(results);
})();
