import { state } from "../GLOBAL/state.js";
import { waves } from "../GLOBAL/waves.js";
import click from "./events/handleClick.js";
import keyDown from "./events/keyDown.js";
import keyUp from "./events/keyUp.js";
import mouseUpDown from "./events/mouseUpDown.js";
import { Block } from "./objects/Blocks.js";
import { GameOverCard } from "./objects/GameOverCard.js";
import Inventory from "./objects/Inventory.js";
import { Player } from "./objects/Player.js";
import { ScoreBoard } from "./objects/ScoreBoard.js";
import SentryCannon from "./objects/SentryCannon.js";
import { Sprite } from "./objects/Sprites.js";
import { Trap } from "./objects/Trap.js";
import { ClimberZombie, NormalZombie } from "./objects/Zombies.js";

let wave = 0;

export const canvas = document.querySelector("canvas");
canvas.height = 760;
canvas.width = 1280;
export const c = canvas.getContext("2d");

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
  clicked: false,
};

//Objects
export const placedItems = [];

export const zombies = [];

const player = new Player({
  position: { x: 100, y: 100 },
});

export const inventory = new Inventory({
  player,
});
inventory.refresh();

player.weapon = inventory.weapon;
inventory.weapon.player = player;

export const scoreBoard = new ScoreBoard({ initScore: 0 });

const gameOverCard = new GameOverCard();

//Sprites
const bgSprite = new Sprite({
  position: { x: 0, y: 0 },
  width: canvas.width,
  height: canvas.height,
  imgSrc: "../../Assets/bg.png",
  scale: 0.525,
  scaleXY: {
    y: 1.12,
    x: 1.14,
  },
});

//animate
function animate() {
  const id = requestAnimationFrame(animate);

  //waves
  if (zombies.length === 0) {
    wave++;
    for (let key in waves) {
      if (key === "NormalZombies") {
        for (let i = 0; i < waves[key] * wave; i++) {
          if (i < (waves[key] * wave) / 2) {
            const zombie = new NormalZombie({
              position: { x: -100 * (i + 1), y: canvas.height - 145 },
            });
            zombies.push(zombie);
          } else {
            const zombie = new NormalZombie({
              position: {
                x: canvas.width + 100 * (i + 1),
                y: canvas.height - 145,
              },
            });
            zombies.push(zombie);
          }
        }
      } else if (key === "ClimberZombies") {
        for (let i = 0; i < waves[key] * wave; i++) {
          if (i < (waves[key] * wave) / 2) {
            const zombie = new ClimberZombie({
              position: { x: -100 * (i + 1), y: canvas.height - 145 },
            });
            zombies.push(zombie);
          } else {
            const zombie = new ClimberZombie({
              position: {
                x: canvas.width + 100 * (i + 1),
                y: canvas.height - 145,
              },
            });
            zombies.push(zombie);
          }
        }
      }
    }
  }

  if (!state.isPaused) {
    bgSprite.update();
    if (state.phase === "prepare") {
      if (inventory.selectedItem) {
        switch (inventory.selectedItem) {
          case "block":
            const block = new Block({ position: { x: mouse.x, y: mouse.y } });
            block.drawHB();
            break;
          case "trap":
            const trap = new Trap({ position: { x: mouse.x, y: mouse.y } });
            trap.drawHB();
            break;
          case "sentryCannon":
            const sentryCannon = new SentryCannon({
              position: { x: mouse.x, y: mouse.y },
            });
            sentryCannon.drawHB();
            break;
        }
      }
    } else if (state.phase === "play") {
      player.update();
      inventory.weapon.update();
      zombies.forEach((z) => {
        z.update({ player });
      });
      if (state.fireMode === "auto" && mouse.clicked) {
        inventory.weapon.fire();
      }
    }

    placedItems.forEach((placedItem) => {
      placedItem.update({ player });
    });
  }

  if (state.gameOver) {
    gameOverCard.refresh({ player });
    gameOverCard.show();
    cancelAnimationFrame(id);
  }
}

//eventListeners

function handleKeyDown(e) {
  keyDown({ e, keys, inventory });
}
window.addEventListener("keydown", handleKeyDown);

function handleKeyUp(e) {
  keyUp({ e, keys, inventory });
}
window.addEventListener("keyup", handleKeyUp);

function handleClick(e) {
  click({ weapon: inventory.weapon });
}
canvas.addEventListener("click", handleClick);

canvas.addEventListener("mousemove", (e) => {
  mouse.x = e.x;
  mouse.y = e.y;
});

function handleMouseDown(e) {
  mouseUpDown({ e });
}
addEventListener("mousedown", handleMouseDown);

function handleMouseUp(e) {
  mouseUpDown({ e });
}
addEventListener("mouseup", handleMouseUp);

animate();
