const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'SV_Easify_vertaling_-_DE_DEF2_translate (1).csv');

console.time('stream');
const stream = fs.createReadStream(filePath);

stream.on('data', () => {});

stream.on('end', () => {
  console.timeEnd('stream');
});

stream.on('error', (err) => {
  console.error(err);
});