function heavyCompute() {
  let sum = 0;
  for (let i = 0; i < 2e9; i++) {
    sum += i;
  }
  return sum;
}

console.time('heavy');
heavyCompute();
console.timeEnd('heavy');
