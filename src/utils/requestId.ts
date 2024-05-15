export function getSigned32BitNumber() {
  const min = -0x80000000; // -2^31
  const max = 0x7fffffff; // 2^31 - 1
  return Math.floor(Math.random() * (max - min + 1) + min);
}
