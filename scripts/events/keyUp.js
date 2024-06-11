export default function keyUp({ e, keys }) {
  switch (e.key) {
    case "d":
      keys.d.pressed = false;
      break;
    case "a":
      keys.a.pressed = false;
      break;
    case "Control":
      keys.Control.pressed = false;
      break;
    case " ":
      keys.space.pressed = false;
      break;
  }
}
