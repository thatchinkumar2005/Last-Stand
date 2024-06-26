import { settings } from "../../GLOBAL/settings.js";
import { c, canvas, placedItems } from "../index.js";
import { Sprite } from "./Sprites.js";

export class Block extends Sprite {
  constructor({
    position = { x: 0, y: 0 },
    height = 100,
    width = 100,
    initialSprite = { imgSrc: "Assets/Block.png", framesMax: 1 },
  }) {
    super({
      position,
      imgSrc: initialSprite.imgSrc,
      framesMax: initialSprite.framesMax,
      scale: 3.12,
    });
    this.position = position;
    this.height = height;
    this.width = width;
    this.name = "block";
    this.velocity = {
      x: 0,
      y: 0,
    };
    this.otherItems = JSON.parse(JSON.stringify(placedItems));
  }

  drawHB() {
    c.fillStyle = "blue";
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }

  update() {
    this.draw();

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    if (this.position.y + this.height >= canvas.height) {
      this.velocity.y = -this.velocity.y * settings.losses;
      this.position.y = canvas.height - this.height;
    } else {
      this.velocity.y += settings.gravity;
    }

    //collision with other placedItems
    this.otherItems.forEach((i) => {
      if (
        this.position.y + this.height > i.position.y &&
        this.position.x + this.width > i.position.x &&
        this.position.x < i.position.x + i.width &&
        i.position.y + i.height > this.position.y
      ) {
        this.velocity.y = 0;
        this.position.y = i.position.y - this.height;
        return;
      }
    });
  }
}
