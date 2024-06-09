import { settings } from "../GLOBAL/settings.js";
import { state } from "../GLOBAL/state.js";
import { waves } from "../GLOBAL/waves.js";
import keyDown from "./events/keyDown.js";
import keyUp from "./events/keyUp.js";
import { Block } from "./objects/Blocks.js";
import Inventory from "./objects/Inventory.js";
import { Player } from "./objects/Player.js";
import { ScoreBoard } from "./objects/ScoreBoard.js";
import { Weapon } from "./objects/Weapons.js";
import { NormalZombie } from "./objects/Zombies.js";

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
export const zombies = [];
const player = new Player({ position: { x: 100, y: 100 } });
const weapon = new Weapon({
  position: {
    x: player.position.x,
    y: player.position.y,
  },
  angle: 0,
  height: 30,
  width: 100,
});
player.weapon = weapon;
weapon.player = player;
export const inventory = new Inventory({
  items: [{ name: "block", count: 5 }],
});
export const scoreBoard = new ScoreBoard({ initScore: 0 });

//animate
for (const [key, value] of Object.entries(waves)) {
  if (key === "NormalZombies") {
    console.log(value);
    for (let i = 0; i < Number(value); i++) {
      const zombie = new NormalZombie({ position: { x: 200 * i, y: 200 } });
      zombies.push(zombie);
    }
  }
}
function animate() {
  requestAnimationFrame(animate);

  if (!state.isPaused && !state.gameOver) {
    c.drawImage(image, 0, 0, 1280, 760);
    if (state.phase === "prepare") {
      if (inventory.selectedItem) {
        if (inventory.selectedItem === "block") {
          c.fillStyle = "rgba(80, 77, 224, 0.8)";
          c.fillRect(mouse.x, mouse.y, 100, 100);
        }
      }
    } else {
      player.update();
      weapon.update();
      zombies.forEach((z) => {
        z.update({ player });
      });
    }

    placedItems.forEach((placedItem) => {
      placedItem.update({ player });
    });
  }
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
  if (state.phase === "play") {
    weapon.fire();
  }
});

canvas.addEventListener("mousemove", (e) => {
  mouse.x = e.x;
  mouse.y = e.y;
});
