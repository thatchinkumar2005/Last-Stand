import { settings } from "../GLOBAL/settings.js";
import { state } from "../GLOBAL/state.js";
import keyDown from "./events/keyDown.js";
import keyUp from "./events/keyUp.js";
import { Block } from "./objects/Blocks.js";
import Inventory from "./objects/Inventory.js";
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

export const mouse = {
  x: canvas.width / 2,
  y: canvas.height / 2,
};

//Objects
export const placedItems = [];
const player = new Player({ position: { x: 100, y: 100 } });
const inventory = new Inventory({ items: [{ name: "block", count: 5 }] });

//animate
function animate() {
  requestAnimationFrame(animate);
  c.drawImage(image, 0, 0, 1280, 760);

  if (state.phase === "prepare") {
    if (inventory.selectedItem) {
      if (inventory.selectedItem === "block") {
        c.fillStyle = "rgba(80, 77, 224, 0.8)";
        c.fillRect(mouse.x, mouse.y, 100, 100);
      }
    }
  } else {
    player.update({ placedItems });
  }

  placedItems.forEach((placedItem) => {
    placedItem.update({ player });
  });
}

//eventListeners

function handleKeyDown(e) {
  keyDown(e, keys, inventory);
}
window.addEventListener("keydown", handleKeyDown);

function handleKeyUp(e) {
  keyUp(e, keys, inventory);
}
window.addEventListener("keyup", handleKeyUp);

canvas.addEventListener("click", () => {
  if (inventory.selectedItem) {
    if (inventory.selectedItem === "block") {
      const block = new Block({
        position: { x: mouse.x, y: mouse.y },
        otherItems: structuredClone(placedItems),
      });
      placedItems.push(block);
      inventory.items[0].count--;

      if (inventory.items[0].count === 0) inventory.selectedItem = null;
      console.log(inventory.items);
    }
  }
});

canvas.addEventListener("mousemove", (e) => {
  mouse.x = e.x;
  mouse.y = e.y;
});
