export default function randRange(init, final) {
  return Math.floor(Math.random() * (final - init) + init);
}

console.log(randRange(10, 30));
