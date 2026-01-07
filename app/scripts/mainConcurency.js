const { Queue } = require('bullmq');

const queue = new Queue('files', {
  connection: {
    host: '127.0.0.1',
    port: 6379
  }
});

(async () => {
  for (let i = 1; i <= 5; i++) {
    await queue.add('file', {
      filePath: `./data/file${i}.csv`
    });
    console.log('Added file', i);
  }
})();
