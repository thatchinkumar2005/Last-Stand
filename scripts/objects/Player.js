import { settings } from "../../GLOBAL/settings.js";
import { c, canvas, keys } from "../index.js";

class Player {
  constructor({ position = { x: 0, y: 0 } }) {
    const height = 140;
    const width = 70;
    this.position = position;
    this.height = height;
    this.width = width;
    this.velocity = { x: 0, y: 0 };
  }

  draw() {
    c.fillStyle = "Red";
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }

  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    if (this.position.y + this.height > canvas.height) {
      this.velocity.y = -this.velocity.y * settings.losses;
    } else {
      this.velocity.y += settings.gravity;
    }

    this.velocity.x = 0;
    if (keys.d.pressed && !keys.Control.pressed) {
      this.velocity.x = settings.walkSpeed;
    } else if (keys.a.pressed && !keys.Control.pressed) {
      this.velocity.x = -settings.walkSpeed;
    } else if (keys.Control.pressed && keys.d.pressed) {
      this.velocity.x = settings.runSpeed;
    } else if (keys.Control.pressed && keys.a.pressed) {
      this.velocity.x = -settings.runSpeed;
    } else if (keys.Control.pressed && !keys.a.pressed && !keys.d.pressed) {
      this.velocity.x = 0;
    }
    if (keys.space.pressed && this.position.y + this.height > canvas.height) {
      this.velocity.y = -15;
    }
  }
}

export { Player };
