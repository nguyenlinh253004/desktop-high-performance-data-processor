// file-worker.js
const { parentPort } = require('worker_threads');
const fs = require('fs');
const readline = require('readline');

parentPort.on('message', async ({ jobId, filePath }) => {
  let lines = 0;

  const stream = fs.createReadStream(filePath);
  const rl = readline.createInterface({ input: stream });

  for await (const _ of rl) {
    lines++;
    if (lines % 10000 === 0) {
      parentPort.postMessage({
        jobId,
        progress: lines
      });
    }
  }

  parentPort.postMessage({
    jobId,
    result: { lines }
  });
});
