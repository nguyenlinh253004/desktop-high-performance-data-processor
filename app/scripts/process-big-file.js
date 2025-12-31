const fs = require('fs');
const path = require('path');
const { Worker } = require('worker_threads');

const filePath = path.join(__dirname, 'big.csv');
const fileSize = fs.statSync(filePath).size;

const worker = new Worker('./csv-worker.js');

let processedBytes = 0;
let totalLines = 0;

worker.on('message', ({ processed }) => {
  totalLines += processed;
});

const stream = fs.createReadStream(filePath, {
  highWaterMark: 1024 * 1024 // 1MB chunk
});

stream.on('data', (chunk) => {
  processedBytes += chunk.length;
  worker.postMessage(chunk);

  const progress = ((processedBytes / fileSize) * 100).toFixed(2);
  console.log(`Progress: ${progress}%`);
});

stream.on('end', () => {
  console.log('Done!');
  console.log('Total lines:', totalLines);
});

stream.on('error', console.error);
