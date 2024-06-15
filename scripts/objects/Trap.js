import { settings } from "../../GLOBAL/settings.js";
import { c, canvas, placedItems, zombies } from "../index.js";

export class Trap {
  constructor({
    position,
    velocity = { x: 0, y: 0 },
    height = 30,
    width = 60,
  }) {
    this.position = position;
    this.velocity = velocity;
    this.height = height;
    this.width = width;
    this.name = "trap";
    this.otherItems = [...placedItems];
  }

  drawHB() {
    c.fillStyle = "red";
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }

  update() {
    this.drawHB();

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

    // zombies.forEach((z) => {
    //   if (
    //     z.position.x + z.width > this.x &&
    //     z.position.x < this.position.x + this.width &&
    //     z.position.y + z.height > this.position.x &&
    //     z.position.y < this.position.x + this.height
    //   ) {
    //     z.health = 0;
    //   }
    // });
  }
}
