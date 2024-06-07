import { settings } from "../../GLOBAL/settings.js";
import { c, canvas } from "../index.js";

export class Block {
  constructor({
    position = { x: 0, y: 0 },
    height = 100,
    width = 100,
    otherItems,
  }) {
    this.position = position;
    this.height = height;
    this.width = width;
    this.velocity = {
      x: 0,
      y: 0,
    };
    this.otherItems = otherItems;
  }

  draw() {
    c.fillStyle = "blue";
    c.fillRect(this.position.x, this.position.y, this.height, this.width);
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

    this.otherItems.forEach((i) => {
      if (
        this.position.y + this.height > i.position.y &&
        this.position.x + this.width > i.position.x &&
        this.position.x < i.position.x + i.width
      ) {
        this.velocity.y = 0;
        this.position.y = i.position.y - this.height;
        return;
      }
    });
  }
}
