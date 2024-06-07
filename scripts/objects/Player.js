import { settings } from "../../GLOBAL/settings.js";
import { c, canvas, keys, mouse } from "../index.js";

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

  update({ placedItems }) {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    if (this.position.y + this.height > canvas.height) {
      this.velocity.y = -this.velocity.y * settings.losses;
      this.onGround = true;
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
    if (keys.space.pressed && (this.onGround || this.onItem)) {
      this.velocity.y = -15;
      this.onGround = false;
      this.onItem = false;
    }

    placedItems.forEach((i) => {
      if (
        this.position.x + this.width > i.position.x &&
        this.position.x < i.position.x + i.width &&
        this.position.y + this.height > i.position.y &&
        this.height < i.position.y + i.height
      ) {
        if (this.onGround) {
          if (this.position.x < i.position.x) {
            console.log("left");
            this.position.x = i.position.x - this.width;
          } else if (this.position.x > i.position.x) {
            console.log("right");
            this.position.x = i.position.x + i.width;
          }
        } else {
          this.position.y = i.position.y - this.height - 1;
          this.velocity.y = 0;
          this.onItem = true;
        }
      }
    });
  }
}

export { Player };
