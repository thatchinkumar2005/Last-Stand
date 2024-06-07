export default function keyDown(e, keys) {
  console.log(e.key);
  switch (e.key) {
    case "d":
      keys.d.pressed = true;
      break;
    case "a":
      keys.a.pressed = true;
      break;
    case "Control":
      keys.Control.pressed = true;
      break;
    case " ":
      keys.space.pressed = true;
      break;
  }
}
