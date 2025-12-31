const leaks = [];

setInterval(() => {
  const big = new Array(1e6).fill('*');
  leaks.push(big);
  console.log('heap used:', process.memoryUsage().heapUsed / 1024 / 1024);
}, 1000);