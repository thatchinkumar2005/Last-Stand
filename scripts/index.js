import keyDown from "./events/keyDown.js";
import keyUp from "./events/keyUp.js";
import { Player } from "./objects/Player.js";

export const canvas = document.querySelector("canvas");
canvas.height = 760;
canvas.width = 1280;
export const c = canvas.getContext("2d");

const image = new Image();
image.src = "Assets/bg.png";

image.onload = () => {
  animate();
};

export const keys = {
  d: {
    pressed: false,
  },
  a: {
    pressed: false,
  },
  Control: {
    pressed: false,
  },
  space: {
    pressed: false,
  },
};

//Objects
const player = new Player({ position: { x: 100, y: 100 } });

function animate() {
  requestAnimationFrame(animate);

  c.drawImage(image, 0, 0, 1280, 760);

  player.update({ c });
}

//eventListeners

function handleKeyDown(e) {
  keyDown(e, keys);
  console.log(keys);
}
window.addEventListener("keydown", handleKeyDown);

function handleKeyUp(e) {
  keyUp(e, keys);
  console.log(keys);
}
window.addEventListener("keyup", handleKeyUp);
